import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getInvoiceById } from "../get-invoice-by-id";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-06-01T10:00:00.000Z");

function makeLineItem(id: string) {
  return {
    id,
    invoiceId: "invoice-1",
    description: "Carbon Fiber Wrap - Full",
    quantity: 1,
    unitPrice: 120000,
    totalPrice: 120000,
  };
}

function makePayment(id: string) {
  return {
    id,
    invoiceId: "invoice-1",
    stripePaymentIntentId: `pi_${id}`,
    status: "succeeded",
    amount: 120000,
    createdAt: NOW,
  };
}

function makeInvoiceRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "invoice-1",
    tenantId: "tenant-a",
    bookingId: "booking-1",
    status: "paid",
    totalAmount: 120000,
    createdAt: NOW,
    updatedAt: NOW,
    lineItems: [makeLineItem("li-1")],
    payments: [makePayment("pay-1")],
    ...overrides,
  };
}

// ── getInvoiceById ────────────────────────────────────────────────────────────

describe("getInvoiceById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with id, tenantId, and soft-delete filter", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(
      makeInvoiceRecord() as never
    );

    await getInvoiceById("tenant-a", "invoice-1");

    expect(prisma.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "invoice-1",
          tenantId: "tenant-a",
          deletedAt: null,
        },
      })
    );
  });

  it("returns full detail DTO including line items and payments", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(
      makeInvoiceRecord() as never
    );

    const result = await getInvoiceById("tenant-a", "invoice-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("invoice-1");
    expect(result?.tenantId).toBe("tenant-a");
    expect(result?.status).toBe("paid");
    expect(result?.lineItems).toHaveLength(1);
    expect(result?.lineItems[0].description).toBe("Carbon Fiber Wrap - Full");
    expect(result?.payments).toHaveLength(1);
    expect(result?.payments[0].stripePaymentIntentId).toBe("pi_pay-1");
  });

  it("does not expose deletedAt on the DTO", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(
      makeInvoiceRecord() as never
    );

    const result = await getInvoiceById("tenant-a", "invoice-1");

    expect("deletedAt" in (result ?? {})).toBe(false);
  });

  it("returns null when invoice not found", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    const result = await getInvoiceById("tenant-a", "invoice-999");

    expect(result).toBeNull();
  });

  it("returns null when invoice belongs to a different tenant", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    const result = await getInvoiceById("tenant-b", "invoice-1");

    expect(result).toBeNull();
  });

  it("returns invoice with empty line items and payments when none exist", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(
      makeInvoiceRecord({ lineItems: [], payments: [] }) as never
    );

    const result = await getInvoiceById("tenant-a", "invoice-1");

    expect(result?.lineItems).toHaveLength(0);
    expect(result?.payments).toHaveLength(0);
  });

  it("filters deleted payments via Prisma query", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(
      makeInvoiceRecord() as never
    );

    await getInvoiceById("tenant-a", "invoice-1");

    expect(prisma.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          payments: expect.objectContaining({
            where: { deletedAt: null },
          }),
        }),
      })
    );
  });
});
