import { beforeEach, describe, expect, it, vi } from "vitest";

const construct = vi.hoisted(() => {
  const create = vi.fn();

  class StripeMock {
    checkout = {
      sessions: {
        create,
      },
    };
  }

  return {
    create,
    StripeMock,
  };
});

const { mocks } = vi.hoisted(() => ({
  mocks: {
    getSession: vi.fn(),
    assertTenantMembership: vi.fn(),
    findInvoice: vi.fn(),
    createAuditLog: vi.fn(),
    getHeaders: vi.fn(),
  },
}));

vi.mock("stripe", () => ({
  default: construct.StripeMock,
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

vi.mock("next/headers", () => ({
  headers: mocks.getHeaders,
}));

import { createCheckoutSession } from "../create-checkout-session";

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "https://ctrlplus.test";
    mocks.getSession.mockResolvedValue({ tenantId: "tenant-1", userId: "user-1" });
    mocks.assertTenantMembership.mockResolvedValue(undefined);
    mocks.createAuditLog.mockResolvedValue(undefined);
    construct.create.mockResolvedValue({
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
      lineItems: [{ description: "Wrap", quantity: 1, unitPrice: 15000 }],
    });

    const result = await createCheckoutSession({ invoiceId: "inv-1" });

    expect(mocks.findInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "inv-1", tenantId: "tenant-1", deletedAt: null }),
      }),
    );
    expect(construct.create).toHaveBeenCalledWith(
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
      lineItems: [],
    });

    await expect(createCheckoutSession({ invoiceId: "inv-1" })).rejects.toThrow(
      "Forbidden: invoice is already paid",
    );
  });

  it("uses host fallback when NEXT_PUBLIC_APP_URL is absent", async () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    mocks.getHeaders.mockResolvedValue({ get: vi.fn().mockReturnValue("localhost:3000") });
    mocks.findInvoice.mockResolvedValue({
      id: "inv-1",
      tenantId: "tenant-1",
      totalAmount: 15000,
      status: "sent",
      lineItems: [],
    });

    await createCheckoutSession({ invoiceId: "inv-1" });

    expect(construct.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "http://localhost:3000/billing/inv-1?payment=success",
        cancel_url: "http://localhost:3000/billing/inv-1?payment=cancelled",
      }),
    );
  });
});
