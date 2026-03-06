import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: { findFirst: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

const mockStripeSessionsCreate = vi.fn();
vi.mock("@/lib/billing/stripe", () => ({
  getStripe: vi.fn(() => ({
    checkout: { sessions: { create: mockStripeSessionsCreate } },
  })),
}));

// next/headers is a server-only module — mock it so tests run in node env
vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn((name: string) => (name === "host" ? "tenant.ctrlplus.com" : null)),
  })),
}));

// ─── Imports after mocks ──────────────────────────────────────────────────────

import { createCheckoutSession } from "../create-checkout-session";
import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockSession = {
  user: { id: "user-1", clerkUserId: "clerk-1", email: "member@example.com" },
  tenantId: "tenant-1",
  isAuthenticated: true,
  userId: "user-1",
};

const mockInvoice = {
  id: "inv-001",
  tenantId: "tenant-1",
  totalAmount: 120000,
  status: "sent",
  lineItems: [{ description: "Full Wrap", quantity: 1, unitPrice: 120000 }],
};

const mockStripeSession = {
  id: "cs_test_abc123",
  url: "https://checkout.stripe.com/pay/cs_test_abc123",
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      user: null,
      tenantId: "",
      isAuthenticated: false,
      userId: "",
    });

    await expect(createCheckoutSession({ invoiceId: "inv-001" })).rejects.toThrow("Unauthorized");
  });

  it("throws when assertTenantMembership rejects (non-member)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Unauthorized: not a member of this tenant"),
    );

    await expect(createCheckoutSession({ invoiceId: "inv-001" })).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when invoice is not found (cross-tenant or missing)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    await expect(createCheckoutSession({ invoiceId: "inv-missing" })).rejects.toThrow(
      "Forbidden: invoice not found",
    );
  });

  it("throws Forbidden when invoice is already paid", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue({
      ...mockInvoice,
      status: "paid",
    } as never);

    await expect(createCheckoutSession({ invoiceId: "inv-001" })).rejects.toThrow(
      "Forbidden: invoice is already paid",
    );
  });

  it("creates a Stripe checkout session and returns sessionId and url", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockStripeSessionsCreate.mockResolvedValue(mockStripeSession);

    const result = await createCheckoutSession({ invoiceId: "inv-001" });

    expect(result.sessionId).toBe("cs_test_abc123");
    expect(result.url).toBe("https://checkout.stripe.com/pay/cs_test_abc123");
  });

  it("passes invoice line_items to Stripe", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockStripeSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession({ invoiceId: "inv-001" });

    expect(mockStripeSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            quantity: 1,
            price_data: expect.objectContaining({
              product_data: expect.objectContaining({ name: "Full Wrap" }),
              unit_amount: 120000,
            }),
          }),
        ]),
      }),
    );
  });

  it("derives success_url and cancel_url from the request host (no client input)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockStripeSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession({ invoiceId: "inv-001" });

    const callArgs = mockStripeSessionsCreate.mock.calls[0][0];
    expect(callArgs.success_url).toContain("/billing/inv-001");
    expect(callArgs.success_url).toContain("payment=success");
    expect(callArgs.cancel_url).toContain("/billing/inv-001");
    expect(callArgs.cancel_url).toContain("payment=cancelled");
    // Must be derived from host, not from any client-supplied URL
    expect(callArgs.success_url).toMatch(/^https:\/\/tenant\.ctrlplus\.com/);
  });

  it("sets client_reference_id to the invoice ID for webhook correlation", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockStripeSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession({ invoiceId: "inv-001" });

    expect(mockStripeSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ client_reference_id: "inv-001" }),
    );
  });

  it("writes an audit log after creating the session", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockStripeSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession({ invoiceId: "inv-001" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CREATE_CHECKOUT_SESSION",
          resourceType: "Invoice",
          resourceId: "inv-001",
          tenantId: "tenant-1",
          userId: "user-1",
        }),
      }),
    );
  });

  it("throws when Stripe does not return a checkout URL", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(mockInvoice as never);
    mockStripeSessionsCreate.mockResolvedValue({ id: "cs_test_nourl", url: null });

    await expect(createCheckoutSession({ invoiceId: "inv-001" })).rejects.toThrow(
      "Stripe did not return a checkout URL",
    );
  });

  it("falls back to a single line_item using totalAmount when invoice has no line items", async () => {
    const invoiceNoItems = { ...mockInvoice, lineItems: [] };
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(invoiceNoItems as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockStripeSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession({ invoiceId: "inv-001" });

    expect(mockStripeSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            quantity: 1,
            price_data: expect.objectContaining({ unit_amount: 120000 }),
          }),
        ],
      }),
    );
  });
});
