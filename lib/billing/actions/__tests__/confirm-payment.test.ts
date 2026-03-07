import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  constructWebhookEvent: vi.fn(),
  createStripeWebhookEvent: vi.fn(),
  findStripeWebhookEvent: vi.fn(),
  updateManyStripeWebhookEvent: vi.fn(),
  updateStripeWebhookEvent: vi.fn(),
  findInvoice: vi.fn(),
  updateInvoice: vi.fn(),
  findPayment: vi.fn(),
  createPayment: vi.fn(),
  updateBooking: vi.fn(),
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
      update: mocks.updateInvoice,
    },
    payment: {
      findUnique: mocks.findPayment,
      create: mocks.createPayment,
    },
    booking: {
      update: mocks.updateBooking,
    },
    auditLog: {
      create: mocks.createAuditLog,
    },
    $transaction: mocks.transaction,
  },
}));

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
    mocks.createPayment.mockResolvedValue({ id: "pay_123" });
    mocks.updateInvoice.mockResolvedValue({ id: "inv_123" });
    mocks.updateBooking.mockResolvedValue({ id: "booking_123" });
    mocks.createAuditLog.mockResolvedValue(undefined);
    mocks.updateStripeWebhookEvent.mockResolvedValue(undefined);
    mocks.updateManyStripeWebhookEvent.mockResolvedValue({ count: 0 });
    mocks.transaction.mockImplementation(async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    );
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

  it("returns the existing payment when the Stripe event was already processed", async () => {
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

  it("marks the event as failed when downstream processing throws", async () => {
    mocks.findInvoice.mockResolvedValue(null);

    await expect(confirmPayment("payload", "signature")).rejects.toThrow(
      "Invoice not found: inv_123",
    );

    expect(mocks.updateStripeWebhookEvent).toHaveBeenCalledWith({
      where: { id: "evt_123" },
      data: expect.objectContaining({ status: "failed" }),
    });
  });
});
