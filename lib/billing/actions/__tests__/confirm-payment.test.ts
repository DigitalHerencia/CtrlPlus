import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  constructWebhookEvent: vi.fn(),
  createStripeWebhookEvent: vi.fn(),
  findStripeWebhookEvent: vi.fn(),
  updateManyStripeWebhookEvent: vi.fn(),
  updateStripeWebhookEvent: vi.fn(),
  findInvoice: vi.fn(),
  findPayment: vi.fn(),
  createAuditLog: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/billing/stripe", () => ({
  constructWebhookEvent: mocks.constructWebhookEvent,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: {
      create: mocks.createStripeWebhookEvent,
      findUnique: mocks.findStripeWebhookEvent,
      updateMany: mocks.updateManyStripeWebhookEvent,
      update: mocks.updateStripeWebhookEvent,
    },
    invoice: {
      findFirst: mocks.findInvoice,
      update: vi.fn(),
    },
    payment: {
      findUnique: mocks.findPayment,
      create: vi.fn(),
    },
    booking: {
      update: vi.fn(),
    },
    auditLog: {
      create: mocks.createAuditLog,
    },
    $transaction: mocks.transaction,
  },
}));

import { prisma } from "@/lib/prisma";
import { confirmPayment } from "../confirm-payment";

describe("confirmPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.constructWebhookEvent.mockReturnValue({
      id: "evt_123",
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: "inv_123",
          payment_intent: "pi_123",
          amount_total: 25000,
          metadata: {
            invoiceId: "inv_123",
            tenantId: "tenant_123",
          },
        },
      },
    });

    mocks.createStripeWebhookEvent.mockResolvedValue({
      id: "evt_123",
      status: "processing",
    });
    mocks.findInvoice.mockResolvedValue({
      id: "inv_123",
      tenantId: "tenant_123",
      bookingId: "booking_123",
      totalAmount: 25000,
    });
    mocks.findPayment.mockResolvedValue(null);
    mocks.createAuditLog.mockResolvedValue(undefined);
    mocks.updateStripeWebhookEvent.mockResolvedValue(undefined);
    mocks.updateManyStripeWebhookEvent.mockResolvedValue({ count: 0 });
    mocks.transaction.mockResolvedValue([
      { id: "pay_123" },
      { id: "inv_123" },
      { id: "booking_123" },
    ]);
  });

  it("records the webhook event lifecycle around a successful payment confirmation", async () => {
    const result = await confirmPayment("payload", "signature");

    expect(mocks.createStripeWebhookEvent).toHaveBeenCalledWith({
      data: {
        id: "evt_123",
        type: "checkout.session.completed",
        status: "processing",
      },
    });
    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ invoiceId: "inv_123", stripePaymentIntentId: "pi_123" }),
      }),
    );
    expect(prisma.invoice.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "inv_123" }, data: { status: "paid" } }),
    );
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "booking_123" }, data: { status: "confirmed" } }),
    );
    expect(mocks.updateStripeWebhookEvent).toHaveBeenCalledWith({
      where: { id: "evt_123" },
      data: expect.objectContaining({ status: "processed" }),
    });
    expect(result).toEqual({
      invoiceId: "inv_123",
      paymentId: "pay_123",
      status: "succeeded",
    });
  });

  it("returns existing payment when event id already processed", async () => {
    mocks.createStripeWebhookEvent.mockRejectedValue({ code: "P2002" });
    mocks.findStripeWebhookEvent.mockResolvedValue({ status: "processed" });
    mocks.findPayment.mockResolvedValue({
      id: "pay_existing",
      invoiceId: "inv_123",
      status: "succeeded",
    });

    const result = await confirmPayment("payload", "signature");

    expect(mocks.findInvoice).not.toHaveBeenCalled();
    expect(result).toEqual({
      invoiceId: "inv_123",
      paymentId: "pay_existing",
      status: "succeeded",
    });
  });

  it("throws on invalid stripe signature", async () => {
    mocks.constructWebhookEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature for payload");
    });

    await expect(confirmPayment("payload", "bad-signature")).rejects.toThrow(
      "Invalid Stripe webhook signature",
    );
    expect(mocks.createStripeWebhookEvent).not.toHaveBeenCalled();
  });

  it("marks ignored events as processed for idempotency tracking", async () => {
    mocks.constructWebhookEvent.mockReturnValue({
      id: "evt_ignored",
      type: "payment_intent.created",
      data: { object: {} },
    });

    await expect(confirmPayment("payload", "signature")).rejects.toThrow(
      "Unhandled Stripe event type: payment_intent.created",
    );

    expect(mocks.createStripeWebhookEvent).toHaveBeenCalledWith({
      data: {
        id: "evt_ignored",
        type: "payment_intent.created",
        status: "processing",
      },
    });
    expect(mocks.updateStripeWebhookEvent).toHaveBeenCalledWith({
      where: { id: "evt_ignored" },
      data: expect.objectContaining({ status: "processed" }),
    });
  });
});
