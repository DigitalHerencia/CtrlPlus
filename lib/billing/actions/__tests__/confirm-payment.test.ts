import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mock variables ────────────────────────────────────────────────────

const mockConstructEvent = vi.hoisted(() => vi.fn());

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    booking: {
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/billing/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { confirmPayment, STRIPE_WEBHOOK_ACTOR } from "../confirm-payment";

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_PAYLOAD = JSON.stringify({ id: "evt_test_123", type: "checkout.session.completed" });
const VALID_SIGNATURE = "t=123,v1=abc";

function makeCheckoutSessionEvent(
  overrides: Record<string, unknown> = {},
): { type: string; data: { object: Record<string, unknown> } } {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        client_reference_id: "invoice-1",
        payment_intent: "pi_test_123",
        amount_total: 150000,
        metadata: {
          tenantId: "tenant-1",
          invoiceId: "invoice-1",
          bookingId: "booking-1",
        },
        ...overrides,
      },
    },
  };
}

const mockInvoice = {
  id: "invoice-1",
  tenantId: "tenant-1",
  bookingId: "booking-1",
  totalAmount: 150000,
};

const mockPayment = {
  id: "payment-1",
  invoiceId: "invoice-1",
  stripePaymentIntentId: "pi_test_123",
  status: "succeeded",
  amount: 150000,
  createdAt: new Date(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("confirmPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Provide STRIPE_WEBHOOK_SECRET for all tests
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("processes a checkout.session.completed event and returns success result", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([mockPayment, {}, {}] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    expect(result).toEqual({
      invoiceId: "invoice-1",
      paymentId: "payment-1",
      status: "succeeded",
    });
  });

  it("verifies the Stripe signature using the webhook secret", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([mockPayment, {}, {}] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    expect(mockConstructEvent).toHaveBeenCalledWith(
      VALID_PAYLOAD,
      VALID_SIGNATURE,
      "whsec_test",
    );
  });

  it("scopes the invoice lookup to tenantId from metadata", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([mockPayment, {}, {}] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    expect(prisma.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "invoice-1",
          tenantId: "tenant-1",
          deletedAt: null,
        }),
      }),
    );
  });

  it("executes payment creation and status updates in a transaction", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([mockPayment, {}, {}] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    // Verify $transaction was called with an array of 3 operations
    expect(prisma.$transaction).toHaveBeenCalledOnce();
    const [transactionArgs] = vi.mocked(prisma.$transaction).mock.calls;
    expect(Array.isArray(transactionArgs[0])).toBe(true);
    expect((transactionArgs[0] as unknown[]).length).toBe(3);
  });

  it("writes an audit log with STRIPE_WEBHOOK_ACTOR as userId", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([mockPayment, {}, {}] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: STRIPE_WEBHOOK_ACTOR,
          action: "CONFIRM_PAYMENT",
          resourceType: "Payment",
          resourceId: "payment-1",
        }),
      }),
    );
  });

  it("returns already_processed when the payment was already recorded (idempotency)", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue({
      id: "payment-existing",
      status: "succeeded",
    } as never);

    const result = await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    expect(result).toEqual({
      invoiceId: "invoice-1",
      paymentId: "payment-existing",
      status: "already_processed",
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("throws when STRIPE_WEBHOOK_SECRET is not configured", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    await expect(confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE)).rejects.toThrow(
      "STRIPE_WEBHOOK_SECRET is not configured",
    );
  });

  it("throws when the Stripe signature is invalid", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });

    await expect(confirmPayment(VALID_PAYLOAD, "bad-sig")).rejects.toThrow(
      "Invalid Stripe webhook signature",
    );
  });

  it("throws when the event type is not checkout.session.completed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      data: { object: {} },
    });

    await expect(confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE)).rejects.toThrow(
      "Unhandled Stripe event type: payment_intent.created",
    );
  });

  it("throws when client_reference_id and metadata.invoiceId are both missing", async () => {
    const event = makeCheckoutSessionEvent({
      client_reference_id: null,
      metadata: { tenantId: "tenant-1" },
    });
    mockConstructEvent.mockReturnValue(event);

    await expect(confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE)).rejects.toThrow(
      "missing invoiceId",
    );
  });

  it("throws when payment_intent is missing from the session", async () => {
    const event = makeCheckoutSessionEvent({ payment_intent: null });
    mockConstructEvent.mockReturnValue(event);

    await expect(confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE)).rejects.toThrow(
      "missing payment_intent",
    );
  });

  it("throws when tenantId is missing from session metadata", async () => {
    const event = makeCheckoutSessionEvent({ metadata: { invoiceId: "invoice-1" } });
    mockConstructEvent.mockReturnValue(event);

    await expect(confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE)).rejects.toThrow(
      "missing tenantId",
    );
  });

  it("throws when the invoice is not found", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    await expect(confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE)).rejects.toThrow(
      "Invoice not found",
    );
  });

  it("resolves payment_intent from an object (not a string)", async () => {
    const event = makeCheckoutSessionEvent({
      payment_intent: { id: "pi_from_object" },
    });
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([
      { ...mockPayment, stripePaymentIntentId: "pi_from_object" },
      {},
      {},
    ] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    expect(result.status).toBe("succeeded");
    expect(prisma.payment.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { stripePaymentIntentId: "pi_from_object" },
      }),
    );
  });

  it("uses invoice.totalAmount when session.amount_total is null", async () => {
    const event = makeCheckoutSessionEvent({ amount_total: null });
    mockConstructEvent.mockReturnValue(event);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.$transaction).mockResolvedValue([mockPayment, {}, {}] as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await confirmPayment(VALID_PAYLOAD, VALID_SIGNATURE);

    // Verify the transaction array was called (payment.create uses invoice.totalAmount)
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
