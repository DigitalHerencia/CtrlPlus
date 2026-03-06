import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    invoice: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// ─── Import fetchers after mock is set up ────────────────────────────────────

import { getInvoicesForTenant } from "../get-invoices";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockInvoiceRow = {
  id: "inv-001",
  tenantId: "tenant-abc",
  bookingId: "booking-001",
  status: "sent",
  totalAmount: 120000,
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
  updatedAt: new Date("2024-02-02T00:00:00.000Z"),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getInvoicesForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a paginated InvoiceListResult", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([mockInvoiceRow]);
    prismaMock.invoice.count.mockResolvedValue(1);

    const result = await getInvoicesForTenant("tenant-abc");

    expect(result.invoices).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.totalPages).toBe(1);
  });

  it("maps row to InvoiceDTO correctly", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([mockInvoiceRow]);
    prismaMock.invoice.count.mockResolvedValue(1);

    const result = await getInvoicesForTenant("tenant-abc");

    expect(result.invoices[0]).toEqual({
      id: "inv-001",
      tenantId: "tenant-abc",
      bookingId: "booking-001",
      status: "sent",
      totalAmount: 120000,
      createdAt: mockInvoiceRow.createdAt,
      updatedAt: mockInvoiceRow.updatedAt,
    });
  });

  it("scopes query by tenantId and deletedAt: null", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoice.count.mockResolvedValue(0);

    await getInvoicesForTenant("tenant-abc");

    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
    expect(prismaMock.invoice.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("applies status filter when provided", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoice.count.mockResolvedValue(0);

    await getInvoicesForTenant("tenant-abc", { page: 1, pageSize: 20, status: "paid" });

    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "paid" }),
      }),
    );
  });

  it("does not include status filter when not provided", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoice.count.mockResolvedValue(0);

    await getInvoicesForTenant("tenant-abc");

    const callArgs = prismaMock.invoice.findMany.mock.calls[0][0];
    expect(callArgs.where).not.toHaveProperty("status");
  });

  it("computes correct totalPages", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoice.count.mockResolvedValue(45);

    const result = await getInvoicesForTenant("tenant-abc", { page: 1, pageSize: 20 });

    expect(result.totalPages).toBe(3);
  });

  it("returns empty array when no invoices exist", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoice.count.mockResolvedValue(0);

    const result = await getInvoicesForTenant("tenant-abc");

    expect(result.invoices).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("uses default pagination when params are omitted", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoice.count.mockResolvedValue(0);

    const result = await getInvoicesForTenant("tenant-abc");

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });
});
