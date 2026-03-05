import { describe, it, expect, vi, beforeEach } from "vitest";
import { InvoiceStatus } from "@prisma/client";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getInvoicesForTenant,
  getInvoiceById,
  getPaymentStatus,
  getInvoiceCountByStatus,
} from "../get-invoices";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-06-01T10:00:00.000Z");

function makeInvoiceRecord(
  overrides: Partial<ReturnType<typeof baseRecord>> = {}
) {
  return { ...baseRecord(), ...overrides };
}

function baseRecord(): {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: { toString(): string };
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: "invoice-1",
    tenantId: "tenant-a",
    bookingId: "booking-1",
    amount: { toString: () => "1200.00" },
    status: InvoiceStatus.PENDING,
    stripeCheckoutSessionId: null,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

// ── getInvoicesForTenant ──────────────────────────────────────────────────────

describe("getInvoicesForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with tenant scope", async () => {
    const record = makeInvoiceRecord();
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([record] as never);
    vi.mocked(prisma.invoice.count).mockResolvedValue(1);

    await getInvoicesForTenant("tenant-a");

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
        }),
      })
    );
    expect(prisma.invoice.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
        }),
      })
    );
  });

  it("returns items mapped to DTOs (amount as string, no raw Prisma model)", async () => {
    const record = makeInvoiceRecord();
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([record] as never);
    vi.mocked(prisma.invoice.count).mockResolvedValue(1);

    const result = await getInvoicesForTenant("tenant-a");

    expect(result.items).toHaveLength(1);
    const dto = result.items[0];
    expect(dto.id).toBe("invoice-1");
    expect(dto.tenantId).toBe("tenant-a");
    expect(dto.bookingId).toBe("booking-1");
    expect(dto.amount).toBe("1200.00");
    expect(dto.status).toBe(InvoiceStatus.PENDING);
    expect(dto.stripeCheckoutSessionId).toBeNull();
  });

  it("applies pagination correctly", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(55);

    const result = await getInvoicesForTenant("tenant-a", {
      page: 3,
      pageSize: 10,
    });

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    );
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
    expect(result.total).toBe(55);
    expect(result.totalPages).toBe(6);
  });

  it("applies optional status filter", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(0);

    await getInvoicesForTenant("tenant-a", {
      page: 1,
      pageSize: 20,
      status: InvoiceStatus.PAID,
    });

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: InvoiceStatus.PAID }),
      })
    );
  });

  it("orders results by createdAt descending", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(0);

    await getInvoicesForTenant("tenant-a");

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "desc" } })
    );
  });

  it("returns empty list when no invoices exist", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(0);

    const result = await getInvoicesForTenant("tenant-a");

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("uses explicit select fields", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(0);

    await getInvoicesForTenant("tenant-a");

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          id: true,
          tenantId: true,
          bookingId: true,
          amount: true,
          status: true,
          stripeCheckoutSessionId: true,
          createdAt: true,
          updatedAt: true,
        }),
      })
    );
  });
});

// ── getInvoiceById ────────────────────────────────────────────────────────────

describe("getInvoiceById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with id and tenantId scope", async () => {
    const record = makeInvoiceRecord();
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(record as never);

    await getInvoiceById("tenant-a", "invoice-1");

    expect(prisma.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "invoice-1",
          tenantId: "tenant-a",
        },
      })
    );
  });

  it("returns mapped DTO when record exists", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(
      makeInvoiceRecord() as never
    );

    const result = await getInvoiceById("tenant-a", "invoice-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("invoice-1");
    expect(result?.amount).toBe("1200.00");
  });

  it("returns null when record not found or belongs to another tenant", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    const result = await getInvoiceById("tenant-b", "invoice-1");

    expect(result).toBeNull();
  });

  it("maps stripeCheckoutSessionId correctly when present", async () => {
    const record = makeInvoiceRecord({
      stripeCheckoutSessionId: "cs_test_abc123",
      status: InvoiceStatus.PAID,
    });
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(record as never);

    const result = await getInvoiceById("tenant-a", "invoice-1");

    expect(result?.stripeCheckoutSessionId).toBe("cs_test_abc123");
    expect(result?.status).toBe(InvoiceStatus.PAID);
  });
});

// ── getPaymentStatus ──────────────────────────────────────────────────────────

describe("getPaymentStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with id and tenantId scope", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue({
      id: "invoice-1",
      status: InvoiceStatus.PENDING,
      stripeCheckoutSessionId: null,
      updatedAt: NOW,
    } as never);

    await getPaymentStatus("tenant-a", "invoice-1");

    expect(prisma.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "invoice-1",
          tenantId: "tenant-a",
        },
      })
    );
  });

  it("returns PaymentStatusDTO when record exists", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue({
      id: "invoice-1",
      status: InvoiceStatus.PAID,
      stripeCheckoutSessionId: "cs_test_xyz",
      updatedAt: NOW,
    } as never);

    const result = await getPaymentStatus("tenant-a", "invoice-1");

    expect(result).not.toBeNull();
    expect(result?.invoiceId).toBe("invoice-1");
    expect(result?.status).toBe(InvoiceStatus.PAID);
    expect(result?.stripeCheckoutSessionId).toBe("cs_test_xyz");
    expect(result?.updatedAt).toBe(NOW);
  });

  it("returns null when record not found or belongs to another tenant", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    const result = await getPaymentStatus("tenant-b", "invoice-1");

    expect(result).toBeNull();
  });

  it("selects only the payment-status relevant fields", async () => {
    vi.mocked(prisma.invoice.findFirst).mockResolvedValue(null);

    await getPaymentStatus("tenant-a", "invoice-1");

    expect(prisma.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          status: true,
          stripeCheckoutSessionId: true,
          updatedAt: true,
        },
      })
    );
  });
});

// ── getInvoiceCountByStatus ───────────────────────────────────────────────────

describe("getInvoiceCountByStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("groups by status scoped to tenant", async () => {
    vi.mocked(prisma.invoice.groupBy).mockResolvedValue([
      { status: InvoiceStatus.PENDING, _count: { id: 3 } },
      { status: InvoiceStatus.PAID, _count: { id: 7 } },
    ] as never);

    await getInvoiceCountByStatus("tenant-a");

    expect(prisma.invoice.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        by: ["status"],
        where: { tenantId: "tenant-a" },
        _count: { id: true },
      })
    );
  });

  it("returns array of InvoiceCountByStatusDTO", async () => {
    vi.mocked(prisma.invoice.groupBy).mockResolvedValue([
      { status: InvoiceStatus.PENDING, _count: { id: 3 } },
      { status: InvoiceStatus.PAID, _count: { id: 7 } },
      { status: InvoiceStatus.VOID, _count: { id: 1 } },
    ] as never);

    const result = await getInvoiceCountByStatus("tenant-a");

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        { status: InvoiceStatus.PENDING, count: 3 },
        { status: InvoiceStatus.PAID, count: 7 },
        { status: InvoiceStatus.VOID, count: 1 },
      ])
    );
  });

  it("returns empty array when no invoices exist for tenant", async () => {
    vi.mocked(prisma.invoice.groupBy).mockResolvedValue([]);

    const result = await getInvoiceCountByStatus("tenant-a");

    expect(result).toHaveLength(0);
  });
});
