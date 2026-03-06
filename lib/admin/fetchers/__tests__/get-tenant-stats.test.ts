import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    wrap: { count: vi.fn() },
    tenantUserMembership: { count: vi.fn() },
    booking: { count: vi.fn() },
    invoice: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { getTenantStats } from "../get-tenant-stats";

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getTenantStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns counts and revenue scoped to the tenant", async () => {
    prismaMock.wrap.count.mockResolvedValue(5);
    prismaMock.tenantUserMembership.count.mockResolvedValue(3);
    prismaMock.booking.count.mockResolvedValue(12);
    prismaMock.invoice.findMany.mockResolvedValue([
      { totalAmount: 5000 },
      { totalAmount: 3000 },
    ]);

    const result = await getTenantStats("tenant-abc");

    expect(result.wrapCount).toBe(5);
    expect(result.memberCount).toBe(3);
    expect(result.bookingCount).toBe(12);
    expect(result.totalRevenue).toBe(8000);
  });

  it("scopes wrap count query by tenantId and deletedAt: null", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    await getTenantStats("tenant-abc");

    expect(prismaMock.wrap.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("scopes member count query by tenantId and deletedAt: null", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    await getTenantStats("tenant-abc");

    expect(prismaMock.tenantUserMembership.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("scopes booking count query by tenantId and deletedAt: null", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    await getTenantStats("tenant-abc");

    expect(prismaMock.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("fetches only paid invoices scoped to the tenant", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    await getTenantStats("tenant-abc");

    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-abc",
          status: "paid",
          deletedAt: null,
        }),
      }),
    );
  });

  it("returns zero totalRevenue when there are no paid invoices", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    const result = await getTenantStats("tenant-abc");

    expect(result.totalRevenue).toBe(0);
  });

  it("sums totalAmount across multiple paid invoices", async () => {
    prismaMock.wrap.count.mockResolvedValue(1);
    prismaMock.tenantUserMembership.count.mockResolvedValue(1);
    prismaMock.booking.count.mockResolvedValue(1);
    prismaMock.invoice.findMany.mockResolvedValue([
      { totalAmount: 1000 },
      { totalAmount: 2500 },
      { totalAmount: 750 },
    ]);

    const result = await getTenantStats("tenant-abc");

    expect(result.totalRevenue).toBe(4250);
  });
});
