import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCheckoutSession,
  updateInvoiceStatus,
} from "../create-checkout-session";

// ---------------------------------------------------------------------------
// Hoisted mock variables
// ---------------------------------------------------------------------------

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  assertTenantMembership: vi.fn(),
  invoiceFindFirst: vi.fn(),
  invoiceUpdate: vi.fn(),
  auditLogCreate: vi.fn(),
  stripeSessionCreate: vi.fn(),
  getStripe: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/auth/session", () => ({
  getSession: mocks.getSession,
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mocks.assertTenantMembership,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findFirst: mocks.invoiceFindFirst,
      update: mocks.invoiceUpdate,
    },
    auditLog: {
      create: mocks.auditLogCreate,
    },
  },
}));

vi.mock("@/lib/billing/stripe", () => ({
  getStripe: mocks.getStripe,
}));

// ---------------------------------------------------------------------------
// Default test fixtures
// ---------------------------------------------------------------------------

const validInput = {
  invoiceId: "inv_abc123",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
};

const mockSession = {
  user: { id: "user_123", clerkUserId: "clerk_123", email: "user@example.com" },
  tenantId: "tenant_xyz",
};

const mockInvoice = {
  id: "inv_abc123",
  tenantId: "tenant_xyz",
  bookingId: "booking_def",
  amount: 1200,
  status: "PENDING",
  stripeCheckoutSessionId: null,
  stripePaymentIntentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockStripeSession = {
  id: "cs_test_456",
  url: "https://checkout.stripe.com/pay/cs_test_456",
};

// ---------------------------------------------------------------------------
// Tests: createCheckoutSession
// ---------------------------------------------------------------------------

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.assertTenantMembership.mockResolvedValue(undefined);
    mocks.auditLogCreate.mockResolvedValue({});
    mocks.invoiceUpdate.mockResolvedValue({
      ...mockInvoice,
      stripeCheckoutSessionId: mockStripeSession.id,
    });
    mocks.getStripe.mockReturnValue({
      checkout: {
        sessions: {
          create: mocks.stripeSessionCreate,
        },
      },
    });
    mocks.stripeSessionCreate.mockResolvedValue(mockStripeSession);
  });

  // ─── Authentication ───────────────────────────────────────────────────────

  it("returns error when user is not authenticated", async () => {
    mocks.getSession.mockResolvedValue({ user: null, tenantId: "" });

    const result = await createCheckoutSession(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/unauthorized/i);
    }
  });

  // ─── Authorization ────────────────────────────────────────────────────────

  it("calls assertTenantMembership with correct tenant and user", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    await createCheckoutSession(validInput);

    expect(mocks.assertTenantMembership).toHaveBeenCalledWith(
      "tenant_xyz",
      "user_123",
      expect.arrayContaining(["owner", "admin", "member"])
    );
  });

  it("propagates authorization errors", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.assertTenantMembership.mockRejectedValue(
      new Error("Forbidden: insufficient permissions")
    );

    await expect(createCheckoutSession(validInput)).rejects.toThrow(
      "Forbidden"
    );
  });

  // ─── Validation ───────────────────────────────────────────────────────────

  it("throws a Zod error for missing invoiceId", async () => {
    mocks.getSession.mockResolvedValue(mockSession);

    await expect(
      createCheckoutSession({
        invoiceId: "",
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
      })
    ).rejects.toThrow();
  });

  it("throws a Zod error for invalid successUrl", async () => {
    mocks.getSession.mockResolvedValue(mockSession);

    await expect(
      createCheckoutSession({
        invoiceId: "inv_abc",
        successUrl: "not-a-url",
        cancelUrl: "https://example.com/cancel",
      })
    ).rejects.toThrow();
  });

  it("throws a Zod error for invalid cancelUrl", async () => {
    mocks.getSession.mockResolvedValue(mockSession);

    await expect(
      createCheckoutSession({
        invoiceId: "inv_abc",
        successUrl: "https://example.com/success",
        cancelUrl: "not-a-url",
      })
    ).rejects.toThrow();
  });

  // ─── Tenant ownership ─────────────────────────────────────────────────────

  it("returns error when invoice does not belong to tenant", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(null);

    const result = await createCheckoutSession(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/not found|access denied/i);
    }
  });

  it("queries invoice with tenantId scope for ownership check", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    await createCheckoutSession(validInput);

    expect(mocks.invoiceFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "inv_abc123",
          tenantId: "tenant_xyz",
        }),
      })
    );
  });

  it("returns error when invoice is already paid", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue({
      ...mockInvoice,
      status: "PAID",
    });

    const result = await createCheckoutSession(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/already been paid/i);
    }
  });

  it("returns error when invoice has been cancelled", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue({
      ...mockInvoice,
      status: "CANCELLED",
    });

    const result = await createCheckoutSession(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/cancelled/i);
    }
  });

  // ─── Stripe session creation ──────────────────────────────────────────────

  it("creates a Stripe checkout session with correct line item", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    await createCheckoutSession(validInput);

    expect(mocks.stripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: "usd",
              unit_amount: 120000, // 1200 * 100
            }),
            quantity: 1,
          }),
        ]),
        success_url: validInput.successUrl,
        cancel_url: validInput.cancelUrl,
      })
    );
  });

  it("includes tenant metadata in the Stripe session", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    await createCheckoutSession(validInput);

    expect(mocks.stripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          tenantId: "tenant_xyz",
          invoiceId: "inv_abc123",
        }),
      })
    );
  });

  it("returns error when Stripe does not return a URL", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);
    mocks.stripeSessionCreate.mockResolvedValue({ id: "cs_nurl", url: null });

    const result = await createCheckoutSession(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/checkout url/i);
    }
  });

  // ─── Persistence ──────────────────────────────────────────────────────────

  it("persists the Stripe session ID on the invoice", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    await createCheckoutSession(validInput);

    expect(mocks.invoiceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "inv_abc123" },
        data: expect.objectContaining({
          stripeCheckoutSessionId: "cs_test_456",
        }),
      })
    );
  });

  it("writes an audit log entry on success", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    await createCheckoutSession(validInput);

    expect(mocks.auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant_xyz",
          userId: "user_123",
          action: "BILLING_CHECKOUT_INITIATED",
          resourceId: "inv_abc123",
        }),
      })
    );
  });

  // ─── Happy path ───────────────────────────────────────────────────────────

  it("returns checkoutUrl and sessionId on success", async () => {
    mocks.getSession.mockResolvedValue(mockSession);
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);

    const result = await createCheckoutSession(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.checkoutUrl).toBe(
        "https://checkout.stripe.com/pay/cs_test_456"
      );
      expect(result.data.sessionId).toBe("cs_test_456");
    }
  });
});

// ---------------------------------------------------------------------------
// Tests: updateInvoiceStatus
// ---------------------------------------------------------------------------

describe("updateInvoiceStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auditLogCreate.mockResolvedValue({});
  });

  it("returns error when invoice is not found for the tenant", async () => {
    mocks.invoiceFindFirst.mockResolvedValue(null);

    const result = await updateInvoiceStatus("inv_xyz", "other_tenant", "PAID");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/not found/i);
    }
  });

  it("queries invoice with tenantId scope", async () => {
    mocks.invoiceFindFirst.mockResolvedValue(null);

    await updateInvoiceStatus("inv_xyz", "tenant_abc", "PAID");

    expect(mocks.invoiceFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "inv_xyz",
          tenantId: "tenant_abc",
        }),
      })
    );
  });

  it("updates invoice status and returns updated DTO", async () => {
    const updatedInvoice = {
      ...mockInvoice,
      status: "PAID",
      stripeCheckoutSessionId: "cs_test_789",
    };

    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);
    mocks.invoiceUpdate.mockResolvedValue(updatedInvoice);

    const result = await updateInvoiceStatus(
      "inv_abc123",
      "tenant_xyz",
      "PAID",
      "cs_test_789"
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("PAID");
      expect(result.data.stripeCheckoutSessionId).toBe("cs_test_789");
    }
  });

  it("writes an audit log on status update", async () => {
    mocks.invoiceFindFirst.mockResolvedValue(mockInvoice);
    mocks.invoiceUpdate.mockResolvedValue({ ...mockInvoice, status: "PAID" });

    await updateInvoiceStatus("inv_abc123", "tenant_xyz", "PAID");

    expect(mocks.auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant_xyz",
          action: "BILLING_STATUS_UPDATED",
          resourceId: "inv_abc123",
        }),
      })
    );
  });
});
