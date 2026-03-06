/**
 * Tests for Stripe Webhook Route
 *
 * Uses mocked Stripe payloads to verify:
 * - Signature verification (200, 400, 401)
 * - Idempotent event processing
 * - checkout.session.completed handling
 * - payment_intent.succeeded handling
 * - payment_intent.payment_failed handling
 * - Audit log creation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/billing/stripe", () => ({
  constructWebhookEvent: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    invoice: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { POST } from "@/app/api/stripe/webhook/route";
import { constructWebhookEvent } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRequest(body: string, signature: string | null = "sig_test"): NextRequest {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (signature !== null) {
    headers["stripe-signature"] = signature;
  }
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

const mockCheckoutEvent = {
  id: "evt_checkout_001",
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_test_001",
      client_reference_id: "invoice-001",
      payment_intent: "pi_test_001",
      amount_total: 150000,
    },
  },
};

const mockPaymentSucceededEvent = {
  id: "evt_pi_succeeded_001",
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_test_002",
      amount: 150000,
    },
  },
};

const mockPaymentFailedEvent = {
  id: "evt_pi_failed_001",
  type: "payment_intent.payment_failed",
  data: {
    object: {
      id: "pi_test_003",
      amount: 150000,
      last_payment_error: { message: "Your card was declined." },
    },
  },
};

const mockInvoice = {
  id: "invoice-001",
  tenantId: "tenant-001",
  bookingId: "booking-001",
  status: "sent",
  totalAmount: 150000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPayment = {
  id: "payment-001",
  invoiceId: "invoice-001",
  stripePaymentIntentId: "pi_test_002",
  status: "pending",
  amount: 150000,
  createdAt: new Date(),
  invoice: mockInvoice,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: $transaction executes the callback immediately
    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      if (typeof fn === "function") {
        return fn(prisma);
      }
      return Promise.all(fn as never[]);
    });
  });

  // ── Signature verification ──────────────────────────────────────────────────

  it("returns 400 when stripe-signature header is missing", async () => {
    const req = buildRequest("{}", null);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/missing stripe-signature/i);
  });

  it("returns 401 when signature verification fails", async () => {
    vi.mocked(constructWebhookEvent).mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });

    const req = buildRequest("{}", "bad_sig");
    const res = await POST(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/invalid signature/i);
  });

  // ── Idempotency ─────────────────────────────────────────────────────────────

  it("returns 200 with duplicate:true for already-processed events", async () => {
    vi.mocked(constructWebhookEvent).mockReturnValue(mockCheckoutEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue({
      id: "evt_checkout_001",
      type: "checkout.session.completed",
      status: "processed",
      processedAt: new Date(),
    });

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.duplicate).toBe(true);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  // ── checkout.session.completed ──────────────────────────────────────────────

  it("handles checkout.session.completed and marks invoice as paid", async () => {
    vi.mocked(constructWebhookEvent).mockReturnValue(mockCheckoutEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({ ...mockInvoice, status: "paid" } as never);
    vi.mocked(prisma.payment.upsert).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);

    // Verify transaction was called
    expect(prisma.$transaction).toHaveBeenCalledOnce();

    // Verify invoice was updated
    expect(prisma.invoice.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "invoice-001" },
        data: { status: "paid" },
      }),
    );

    // Verify payment was upserted
    expect(prisma.payment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { stripePaymentIntentId: "pi_test_001" },
        create: expect.objectContaining({
          invoiceId: "invoice-001",
          status: "succeeded",
        }),
        update: expect.objectContaining({
          status: "succeeded",
        }),
      }),
    );

    // Verify audit log
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-001",
          action: "PAYMENT_SUCCEEDED",
          resourceType: "Invoice",
          resourceId: "invoice-001",
        }),
      }),
    );

    // Verify idempotency record was written
    expect(prisma.stripeWebhookEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: "evt_checkout_001",
          type: "checkout.session.completed",
          status: "processed",
        }),
      }),
    );
  });

  it("skips invoice update when already paid (idempotent)", async () => {
    const paidInvoice = { ...mockInvoice, status: "paid" };

    vi.mocked(constructWebhookEvent).mockReturnValue(mockCheckoutEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(paidInvoice as never);
    vi.mocked(prisma.payment.upsert).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    await POST(req);

    // invoice.update should NOT be called since it's already paid
    expect(prisma.invoice.update).not.toHaveBeenCalled();
  });

  it("skips invoice update when refunded (does not overwrite with paid)", async () => {
    const refundedInvoice = { ...mockInvoice, status: "refunded" };

    vi.mocked(constructWebhookEvent).mockReturnValue(mockCheckoutEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(refundedInvoice as never);
    vi.mocked(prisma.payment.upsert).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    await POST(req);

    // invoice.update should NOT be called since it's already refunded
    expect(prisma.invoice.update).not.toHaveBeenCalled();
  });

  it("returns 500 when checkout.session.completed has no matching invoice", async () => {
    vi.mocked(constructWebhookEvent).mockReturnValue(mockCheckoutEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  // ── payment_intent.succeeded ────────────────────────────────────────────────

  it("handles payment_intent.succeeded and updates payment and invoice", async () => {
    vi.mocked(constructWebhookEvent).mockReturnValue(mockPaymentSucceededEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(mockPayment as never);
    vi.mocked(prisma.payment.update).mockResolvedValue({
      ...mockPayment,
      status: "succeeded",
    } as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({ ...mockInvoice, status: "paid" } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "payment-001" },
        data: { status: "succeeded" },
      }),
    );
    expect(prisma.invoice.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "invoice-001" },
        data: { status: "paid" },
      }),
    );
  });

  it("returns 200 for payment_intent.succeeded with no matching payment record", async () => {
    vi.mocked(constructWebhookEvent).mockReturnValue(mockPaymentSucceededEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    // Should still return 200 — missing payment is a known edge case, not an error
    expect(res.status).toBe(200);
  });

  // ── payment_intent.payment_failed ──────────────────────────────────────────

  it("handles payment_intent.payment_failed and marks payment/invoice as failed", async () => {
    vi.mocked(constructWebhookEvent).mockReturnValue(mockPaymentFailedEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(mockPayment as never);
    vi.mocked(prisma.payment.update).mockResolvedValue({
      ...mockPayment,
      status: "failed",
    } as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "failed",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "payment-001" },
        data: { status: "failed" },
      }),
    );
    expect(prisma.invoice.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "invoice-001" },
        data: { status: "failed" },
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "PAYMENT_INTENT_FAILED",
          resourceType: "Payment",
        }),
      }),
    );
  });

  it("does not overwrite invoice status when already paid during failure event", async () => {
    const paidInvoicePayment = { ...mockPayment, invoice: { ...mockInvoice, status: "paid" } };

    vi.mocked(constructWebhookEvent).mockReturnValue(mockPaymentFailedEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(paidInvoicePayment as never);
    vi.mocked(prisma.payment.update).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    await POST(req);

    // invoice.update should NOT be called — invoice is already "paid"
    expect(prisma.invoice.update).not.toHaveBeenCalled();
  });

  it("does not overwrite invoice status when already refunded during failure event", async () => {
    const refundedInvoicePayment = {
      ...mockPayment,
      invoice: { ...mockInvoice, status: "refunded" },
    };

    vi.mocked(constructWebhookEvent).mockReturnValue(mockPaymentFailedEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);
    vi.mocked(prisma.payment.findUnique).mockResolvedValue(refundedInvoicePayment as never);
    vi.mocked(prisma.payment.update).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    await POST(req);

    // invoice.update should NOT be called — invoice is already "refunded"
    expect(prisma.invoice.update).not.toHaveBeenCalled();
  });

  // ── Unhandled event types ───────────────────────────────────────────────────

  it("returns 200 for unhandled event types without processing", async () => {
    const unknownEvent = {
      id: "evt_unknown_001",
      type: "customer.subscription.created",
      data: { object: {} },
    };

    vi.mocked(constructWebhookEvent).mockReturnValue(unknownEvent as never);
    vi.mocked(prisma.stripeWebhookEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.stripeWebhookEvent.create).mockResolvedValue({} as never);

    const req = buildRequest("{}", "sig_test");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.$transaction).not.toHaveBeenCalled();
    // Idempotency record still written
    expect(prisma.stripeWebhookEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: "evt_unknown_001",
          status: "processed",
        }),
      }),
    );
  });
});
