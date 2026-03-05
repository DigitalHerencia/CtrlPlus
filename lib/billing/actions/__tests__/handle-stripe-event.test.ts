import { describe, it, expect, vi, beforeEach } from "vitest";
import type Stripe from "stripe";
import { handleStripeEvent } from "../handle-stripe-event";

// ---------------------------------------------------------------------------
// Hoisted mock variables
// ---------------------------------------------------------------------------

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
  transaction: vi.fn(),
  txInvoiceFindUnique: vi.fn(),
  txInvoiceUpdate: vi.fn(),
  txBookingUpdate: vi.fn(),
  txAuditLogCreate: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Mock @/lib/prisma
// ---------------------------------------------------------------------------

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: {
      findUnique: mocks.findUnique,
      create: mocks.create,
    },
    $transaction: mocks.transaction,
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEvent(
  type: string,
  data: Record<string, unknown>,
  id = "evt_test_123"
): Stripe.Event {
  return {
    id,
    type,
    object: "event",
    api_version: "2026-02-25.clover",
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: null,
    data: { object: data },
  } as unknown as Stripe.Event;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("handleStripeEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Idempotency ──────────────────────────────────────────────────────────

  describe("idempotency", () => {
    it("skips processing when event already exists", async () => {
      mocks.findUnique.mockResolvedValue({ id: "evt_test_123" });

      const event = makeEvent("checkout.session.completed", { id: "cs_test" });
      await handleStripeEvent(event);

      expect(mocks.create).not.toHaveBeenCalled();
      expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("processes event when it has not been seen before", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const event = makeEvent("customer.created", { id: "cus_test" });
      await handleStripeEvent(event);

      expect(mocks.create).toHaveBeenCalledOnce();
    });
  });

  // ─── Unknown event type ───────────────────────────────────────────────────

  describe("unknown event type", () => {
    it("persists event but does not run any transaction", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const event = makeEvent("customer.created", { id: "cus_test" });
      await handleStripeEvent(event);

      expect(mocks.create).toHaveBeenCalledOnce();
      expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("stores the raw event payload", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const event = makeEvent("customer.updated", { id: "cus_upd" });
      await handleStripeEvent(event);

      expect(mocks.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: event.id,
            type: "customer.updated",
          }),
        })
      );
    });
  });

  // ─── checkout.session.completed ──────────────────────────────────────────

  describe("checkout.session.completed", () => {
    it("persists event and runs transaction for matching invoice", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const mockInvoice = {
        id: "inv_abc",
        tenantId: "tenant_xyz",
        bookingId: "booking_def",
        status: "PENDING",
      };

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique:
                mocks.txInvoiceFindUnique.mockResolvedValue(mockInvoice),
              update: mocks.txInvoiceUpdate.mockResolvedValue({}),
            },
            booking: {
              update: mocks.txBookingUpdate.mockResolvedValue({}),
            },
            auditLog: {
              create: mocks.txAuditLogCreate.mockResolvedValue({}),
            },
          });
        }
      );

      const event = makeEvent("checkout.session.completed", {
        id: "cs_test_456",
        payment_intent: "pi_test_789",
        metadata: { invoiceId: "inv_abc" },
      });

      await handleStripeEvent(event);

      expect(mocks.create).toHaveBeenCalledOnce();
      expect(mocks.transaction).toHaveBeenCalledOnce();
      expect(mocks.txInvoiceUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "inv_abc" },
          data: expect.objectContaining({
            status: "PAID",
            stripeCheckoutSessionId: "cs_test_456",
            stripePaymentIntentId: "pi_test_789",
          }),
        })
      );
    });

    it("confirms the booking after payment", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const mockInvoice = {
        id: "inv_abc",
        tenantId: "tenant_xyz",
        bookingId: "booking_def",
        status: "PENDING",
      };

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique: vi.fn().mockResolvedValue(mockInvoice),
              update: mocks.txInvoiceUpdate.mockResolvedValue({}),
            },
            booking: {
              update: mocks.txBookingUpdate.mockResolvedValue({}),
            },
            auditLog: {
              create: mocks.txAuditLogCreate.mockResolvedValue({}),
            },
          });
        }
      );

      const event = makeEvent("checkout.session.completed", {
        id: "cs_test",
        metadata: { invoiceId: "inv_abc" },
      });

      await handleStripeEvent(event);

      expect(mocks.txBookingUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: "CONFIRMED" },
        })
      );
    });

    it("writes audit log with correct tenantId and action", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const mockInvoice = {
        id: "inv_abc",
        tenantId: "tenant_xyz",
        bookingId: "booking_def",
        status: "PENDING",
      };

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique: vi.fn().mockResolvedValue(mockInvoice),
              update: vi.fn().mockResolvedValue({}),
            },
            booking: {
              update: vi.fn().mockResolvedValue({}),
            },
            auditLog: {
              create: mocks.txAuditLogCreate.mockResolvedValue({}),
            },
          });
        }
      );

      const event = makeEvent("checkout.session.completed", {
        id: "cs_test",
        metadata: { invoiceId: "inv_abc" },
      });

      await handleStripeEvent(event);

      expect(mocks.txAuditLogCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: "tenant_xyz",
            action: "PAYMENT_COMPLETED",
            resourceId: "inv_abc",
          }),
        })
      );
    });

    it("skips transaction when no invoiceId in metadata", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const event = makeEvent("checkout.session.completed", {
        id: "cs_no_meta",
        payment_intent: "pi_test",
        metadata: {},
      });

      await handleStripeEvent(event);

      expect(mocks.create).toHaveBeenCalledOnce();
      expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("skips update when invoice not found in transaction", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique: vi.fn().mockResolvedValue(null),
              update: mocks.txInvoiceUpdate,
            },
            booking: { update: mocks.txBookingUpdate },
            auditLog: { create: mocks.txAuditLogCreate },
          });
        }
      );

      const event = makeEvent("checkout.session.completed", {
        id: "cs_test",
        metadata: { invoiceId: "inv_not_found" },
      });

      await handleStripeEvent(event);

      expect(mocks.txInvoiceUpdate).not.toHaveBeenCalled();
    });
  });

  // ─── payment_intent.succeeded ─────────────────────────────────────────────

  describe("payment_intent.succeeded", () => {
    it("persists event and updates invoice and booking", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const mockInvoice = {
        id: "inv_pi",
        tenantId: "tenant_pi",
        bookingId: "booking_pi",
        status: "PENDING",
      };

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique: vi.fn().mockResolvedValue(mockInvoice),
              update: mocks.txInvoiceUpdate.mockResolvedValue({}),
            },
            booking: {
              update: mocks.txBookingUpdate.mockResolvedValue({}),
            },
            auditLog: {
              create: mocks.txAuditLogCreate.mockResolvedValue({}),
            },
          });
        }
      );

      const event = makeEvent("payment_intent.succeeded", {
        id: "pi_succeeded_abc",
        metadata: { invoiceId: "inv_pi" },
      });

      await handleStripeEvent(event);

      expect(mocks.transaction).toHaveBeenCalledOnce();
      expect(mocks.txInvoiceUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "inv_pi" },
          data: expect.objectContaining({
            status: "PAID",
            stripePaymentIntentId: "pi_succeeded_abc",
          }),
        })
      );
      expect(mocks.txAuditLogCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "PAYMENT_INTENT_SUCCEEDED",
          }),
        })
      );
    });

    it("skips update when invoice is already paid (idempotency guard)", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique: vi
                .fn()
                .mockResolvedValue({ id: "inv_paid", status: "PAID" }),
              update: mocks.txInvoiceUpdate,
            },
            booking: { update: mocks.txBookingUpdate },
            auditLog: { create: mocks.txAuditLogCreate },
          });
        }
      );

      const event = makeEvent("payment_intent.succeeded", {
        id: "pi_dup",
        metadata: { invoiceId: "inv_paid" },
      });

      await handleStripeEvent(event);

      expect(mocks.txInvoiceUpdate).not.toHaveBeenCalled();
    });

    it("skips transaction when no invoiceId in metadata", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      const event = makeEvent("payment_intent.succeeded", {
        id: "pi_no_meta",
        metadata: {},
      });

      await handleStripeEvent(event);

      expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("skips update when invoice not found in transaction", async () => {
      mocks.findUnique.mockResolvedValue(null);
      mocks.create.mockResolvedValue({});

      mocks.transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => {
          await fn({
            invoice: {
              findUnique: vi.fn().mockResolvedValue(null),
              update: mocks.txInvoiceUpdate,
            },
            booking: { update: mocks.txBookingUpdate },
            auditLog: { create: mocks.txAuditLogCreate },
          });
        }
      );

      const event = makeEvent("payment_intent.succeeded", {
        id: "pi_missing",
        metadata: { invoiceId: "inv_not_found" },
      });

      await handleStripeEvent(event);

      expect(mocks.txInvoiceUpdate).not.toHaveBeenCalled();
    });
  });
});
