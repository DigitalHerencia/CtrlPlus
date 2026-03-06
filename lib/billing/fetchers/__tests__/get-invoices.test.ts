import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getInvoicesForTenant } from "../get-invoices";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-06-01T10:00:00.000Z");

function makeInvoiceRecord(overrides: Partial<ReturnType<typeof baseRecord>> = {}) {
  return { ...baseRecord(), ...overrides };
}

function baseRecord() {
  return {
    id: "invoice-1",
    tenantId: "tenant-a",
    bookingId: "booking-1",
    status: "draft",
    totalAmount: 120000,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

// ── getInvoicesForTenant ──────────────────────────────────────────────────────

describe("getInvoicesForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with tenant scope and soft-delete filter", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([makeInvoiceRecord()]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(1);

    await getInvoicesForTenant("tenant-a");

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      })
    );
    expect(prisma.invoice.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      })
    );
  });

  it("returns items mapped to DTOs (no deletedAt exposed)", async () => {
    vi.mocked(prisma.invoice.findMany).mockResolvedValue([makeInvoiceRecord()]);
    vi.mocked(prisma.invoice.count).mockResolvedValue(1);

    const result = await getInvoicesForTenant("tenant-a");

    expect(result.items).toHaveLength(1);
    const dto = result.items[0];
    expect(dto.id).toBe("invoice-1");
    expect(dto.tenantId).toBe("tenant-a");
    expect(dto.bookingId).toBe("booking-1");
    expect(dto.status).toBe("draft");
    expect(dto.totalAmount).toBe(120000);
    expect("deletedAt" in dto).toBe(false);
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
      status: "paid",
    });

    expect(prisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "paid" }),
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
});
