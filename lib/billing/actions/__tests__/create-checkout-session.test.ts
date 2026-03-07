import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  assertTenantMembership: vi.fn(),
  findInvoice: vi.fn(),
  createAuditLog: vi.fn(),
  createStripeSession: vi.fn(),
  getStripeClient: vi.fn(),
  getAppBaseUrl: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  getSession: mocks.getSession,
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mocks.assertTenantMembership,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findFirst: mocks.findInvoice,
    },
    auditLog: {
      create: mocks.createAuditLog,
    },
  },
}));

vi.mock("@/lib/billing/stripe", () => ({
  getStripeClient: mocks.getStripeClient,
  getAppBaseUrl: mocks.getAppBaseUrl,
}));

import { createCheckoutSession } from "../create-checkout-session";

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ tenantId: "tenant-1", userId: "user-1" });
    mocks.assertTenantMembership.mockResolvedValue(undefined);
    mocks.createAuditLog.mockResolvedValue(undefined);
    mocks.getStripeClient.mockReturnValue({
      checkout: {
        sessions: {
          create: mocks.createStripeSession,
        },
      },
    });
    mocks.getAppBaseUrl.mockReturnValue("https://ctrlplus.test");
    mocks.createStripeSession.mockResolvedValue({
      id: "cs_123",
      url: "https://checkout.stripe.com/c/pay_123",
    });
  });

  it("creates checkout session scoped to invoice id and tenant", async () => {
    mocks.findInvoice.mockResolvedValue({
      id: "inv-1",
      tenantId: "tenant-1",
      totalAmount: 15000,
      status: "sent",
      booking: {
        customerId: "user-1",
      },
      lineItems: [{ description: "Wrap", quantity: 1, unitPrice: 15000 }],
    });

    const result = await createCheckoutSession({ invoiceId: "inv-1" });

    expect(mocks.findInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "inv-1", tenantId: "tenant-1", deletedAt: null }),
      }),
    );
    expect(mocks.createStripeSession).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ invoiceId: "inv-1", tenantId: "tenant-1" }),
        client_reference_id: "inv-1",
      }),
    );
    expect(result).toEqual({
      sessionId: "cs_123",
      url: "https://checkout.stripe.com/c/pay_123",
      invoiceId: "inv-1",
    });
  });

  it("throws when unauthenticated", async () => {
    mocks.getSession.mockResolvedValue({ tenantId: "tenant-1", userId: null });

    await expect(createCheckoutSession({ invoiceId: "inv-1" })).rejects.toThrow(
      "Unauthorized: not authenticated",
    );
    expect(mocks.assertTenantMembership).not.toHaveBeenCalled();
  });

  it("throws when invoice is already paid", async () => {
    mocks.findInvoice.mockResolvedValue({
      id: "inv-1",
      tenantId: "tenant-1",
      totalAmount: 15000,
      status: "paid",
      booking: {
        customerId: "user-1",
      },
      lineItems: [],
    });

    await expect(createCheckoutSession({ invoiceId: "inv-1" })).rejects.toThrow(
      "Forbidden: invoice is already paid",
    );
  });

  it("throws when user attempts to pay another user's invoice", async () => {
    mocks.findInvoice.mockResolvedValue({
      id: "inv-1",
      tenantId: "tenant-1",
      totalAmount: 15000,
      status: "sent",
      booking: {
        customerId: "different-user",
      },
      lineItems: [],
    });

    await expect(createCheckoutSession({ invoiceId: "inv-1" })).rejects.toThrow(
      "Forbidden: user cannot pay this invoice",
    );
  });
});
