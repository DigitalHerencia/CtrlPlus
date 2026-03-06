import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Prisma mock ──────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenantUserMembership: {
      count: vi.fn(),
    },
    booking: {
      count: vi.fn(),
    },
    invoice: {
      aggregate: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// ─── Import after mock ────────────────────────────────────────────────────────

import { getTenantStats } from "../get-tenant-stats";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getTenantStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns aggregated stats for the tenant", async () => {
    prismaMock.tenantUserMembership.count.mockResolvedValue(5);
    prismaMock.booking.count.mockResolvedValue(42);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: 150000 } });

    const result = await getTenantStats("tenant-abc");

    expect(result).toEqual({
      totalMembers: 5,
      totalBookings: 42,
      totalRevenue: 150000,
    });
  });

  it("scopes all queries by tenantId", async () => {
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc");

    expect(prismaMock.tenantUserMembership.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
    expect(prismaMock.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
    expect(prismaMock.invoice.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
  });

  it("filters soft-deleted members and bookings", async () => {
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc");

    expect(prismaMock.tenantUserMembership.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
    expect(prismaMock.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });

  it("only counts paid invoices for revenue", async () => {
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc");

    expect(prismaMock.invoice.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "paid", deletedAt: null }),
      }),
    );
  });

  it("returns zero revenue when no paid invoices exist", async () => {
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    const result = await getTenantStats("tenant-abc");

    expect(result.totalRevenue).toBe(0);
  });
});
