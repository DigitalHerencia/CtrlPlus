import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    invoice: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// ─── Import fetcher after mock is set up ─────────────────────────────────────

import { getInvoiceById } from "../get-invoice-by-id";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockInvoiceDetailRow = {
  id: "inv-001",
  tenantId: "tenant-abc",
  bookingId: "booking-001",
  status: "sent",
  totalAmount: 120000,
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
  updatedAt: new Date("2024-02-02T00:00:00.000Z"),
  lineItems: [
    {
      id: "li-001",
      description: "Full Wrap",
      quantity: 1,
      unitPrice: 120000,
      totalPrice: 120000,
    },
  ],
  payments: [
    {
      id: "pay-001",
      stripePaymentIntentId: "pi_test_123",
      status: "succeeded",
      amount: 120000,
      createdAt: new Date("2024-02-03T00:00:00.000Z"),
    },
  ],
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getInvoiceById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an InvoiceDetailDTO when invoice exists for the tenant", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(mockInvoiceDetailRow);

    const result = await getInvoiceById("tenant-abc", "inv-001");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("inv-001");
    expect(result?.tenantId).toBe("tenant-abc");
    expect(result?.status).toBe("sent");
    expect(result?.totalAmount).toBe(120000);
  });

  it("maps line items correctly", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(mockInvoiceDetailRow);

    const result = await getInvoiceById("tenant-abc", "inv-001");

    expect(result?.lineItems).toHaveLength(1);
    expect(result?.lineItems[0]).toEqual({
      id: "li-001",
      description: "Full Wrap",
      quantity: 1,
      unitPrice: 120000,
      totalPrice: 120000,
    });
  });

  it("maps payments correctly", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(mockInvoiceDetailRow);

    const result = await getInvoiceById("tenant-abc", "inv-001");

    expect(result?.payments).toHaveLength(1);
    expect(result?.payments[0].stripePaymentIntentId).toBe("pi_test_123");
    expect(result?.payments[0].status).toBe("succeeded");
    expect(result?.payments[0].invoiceId).toBe("inv-001");
  });

  it("returns null when invoice does not exist", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(null);

    const result = await getInvoiceById("tenant-abc", "inv-999");

    expect(result).toBeNull();
  });

  it("returns null when invoice belongs to a different tenant", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(null);

    const result = await getInvoiceById("tenant-other", "inv-001");

    expect(result).toBeNull();
  });

  it("scopes query by tenantId, id, and deletedAt: null", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(null);

    await getInvoiceById("tenant-abc", "inv-001");

    expect(prismaMock.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "inv-001",
          tenantId: "tenant-abc",
          deletedAt: null,
        }),
      }),
    );
  });
});
