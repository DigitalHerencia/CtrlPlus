import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findFirst: vi.fn(),
    },
    payment: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getPaymentStatusForInvoice } from "../get-payment-status";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-06-01T10:00:00.000Z");

function makeInvoiceStub() {
  return { id: "invoice-1" };
}

function makePaymentRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay-1",
    invoiceId: "invoice-1",
    stripePaymentIntentId: "pi_abc123",
    status: "succeeded",
    amount: 120000,
    createdAt: NOW,
    ...overrides,
  };
}

// ── getPaymentStatusForInvoice ────────────────────────────────────────────────

describe("getPaymentStatusForInvoice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies invoice ownership with tenantId scope", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(makeInvoiceStub() as never);
    vi.mocked(prisma.payment.findMany).mockResolvedValue([]);

    await getPaymentStatusForInvoice("tenant-a", "invoice-1");

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

  it("queries payments scoped to the invoiceId with soft-delete filter", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(makeInvoiceStub() as never);
    vi.mocked(prisma.payment.findMany).mockResolvedValue([makePaymentRecord()]);

    await getPaymentStatusForInvoice("tenant-a", "invoice-1");

    expect(prisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          invoiceId: "invoice-1",
          deletedAt: null,
        },
      })
    );
  });

  it("returns payment DTOs mapped correctly", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(makeInvoiceStub() as never);
    vi.mocked(prisma.payment.findMany).mockResolvedValue([makePaymentRecord()]);

    const result = await getPaymentStatusForInvoice("tenant-a", "invoice-1");

    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    const dto = result![0];
    expect(dto.id).toBe("pay-1");
    expect(dto.invoiceId).toBe("invoice-1");
    expect(dto.stripePaymentIntentId).toBe("pi_abc123");
    expect(dto.status).toBe("succeeded");
    expect(dto.amount).toBe(120000);
    expect("deletedAt" in dto).toBe(false);
  });

  it("returns null when invoice not found or belongs to a different tenant", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    const result = await getPaymentStatusForInvoice("tenant-b", "invoice-1");

    expect(result).toBeNull();
    expect(prisma.payment.findMany).not.toHaveBeenCalled();
  });

  it("returns empty array when invoice has no payments", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(makeInvoiceStub() as never);
    vi.mocked(prisma.payment.findMany).mockResolvedValue([]);

    const result = await getPaymentStatusForInvoice("tenant-a", "invoice-1");

    expect(result).toEqual([]);
  });

  it("orders payments by createdAt ascending", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(makeInvoiceStub() as never);
    vi.mocked(prisma.payment.findMany).mockResolvedValue([]);

    await getPaymentStatusForInvoice("tenant-a", "invoice-1");

    expect(prisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } })
    );
  });
});
