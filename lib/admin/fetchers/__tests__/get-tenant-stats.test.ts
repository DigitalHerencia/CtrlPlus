import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    wrap: { count: vi.fn() },
    tenantUserMembership: { count: vi.fn() },
    booking: { count: vi.fn() },
    invoice: { aggregate: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/admin/rbac", () => ({ assertAdminOrOwner: vi.fn().mockResolvedValue(undefined) }));

import { assertAdminOrOwner } from "@/lib/admin/rbac";
import { getTenantStats } from "../get-tenant-stats";

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getTenantStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assertAdminOrOwner).mockResolvedValue(undefined);
  });

  it("calls assertAdminOrOwner before querying", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc", "user-001");

    expect(assertAdminOrOwner).toHaveBeenCalledWith("tenant-abc", "user-001");
  });

  it("throws when assertAdminOrOwner rejects (member role)", async () => {
    vi.mocked(assertAdminOrOwner).mockRejectedValue(new Error("Forbidden"));

    await expect(getTenantStats("tenant-abc", "user-member")).rejects.toThrow("Forbidden");

    expect(prismaMock.wrap.count).not.toHaveBeenCalled();
  });

  it("returns counts and revenue scoped to the tenant", async () => {
    prismaMock.wrap.count.mockResolvedValue(5);
    prismaMock.tenantUserMembership.count.mockResolvedValue(3);
    prismaMock.booking.count.mockResolvedValue(12);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: 8000 } });

    const result = await getTenantStats("tenant-abc", "user-001");

    expect(result.wrapCount).toBe(5);
    expect(result.memberCount).toBe(3);
    expect(result.bookingCount).toBe(12);
    expect(result.totalRevenue).toBe(8000);
  });

  it("scopes wrap count query by tenantId and deletedAt: null", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc", "user-001");

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
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc", "user-001");

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
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc", "user-001");

    expect(prismaMock.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("uses DB-side aggregation for revenue scoped to paid invoices", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    await getTenantStats("tenant-abc", "user-001");

    expect(prismaMock.invoice.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-abc",
          status: "paid",
          deletedAt: null,
        }),
        _sum: { totalAmount: true },
      }),
    );
  });

  it("returns zero totalRevenue when aggregate sum is null (no paid invoices)", async () => {
    prismaMock.wrap.count.mockResolvedValue(0);
    prismaMock.tenantUserMembership.count.mockResolvedValue(0);
    prismaMock.booking.count.mockResolvedValue(0);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: null } });

    const result = await getTenantStats("tenant-abc", "user-001");

    expect(result.totalRevenue).toBe(0);
  });

  it("returns totalRevenue from aggregate sum when invoices exist", async () => {
    prismaMock.wrap.count.mockResolvedValue(1);
    prismaMock.tenantUserMembership.count.mockResolvedValue(1);
    prismaMock.booking.count.mockResolvedValue(1);
    prismaMock.invoice.aggregate.mockResolvedValue({ _sum: { totalAmount: 4250 } });

    const result = await getTenantStats("tenant-abc", "user-001");

    expect(result.totalRevenue).toBe(4250);
  });
});
