import { prisma } from "@/lib/prisma";
import { assertAdminOrOwner } from "../rbac";
import { type TenantStatsDTO } from "../types";

// ─── Fetcher ──────────────────────────────────────────────────────────────────

/**
 * Returns aggregated dashboard metrics for a tenant.
 *
 * All counts are scoped to active (non-deleted) records only.
 * Revenue is the DB-side sum of `totalAmount` for all invoices with status "paid".
 *
 * @param tenantId         - Tenant scope (server-side verified; never accept from client)
 * @param requestingUserId - Clerk user ID of the caller; must be admin or owner
 * @returns TenantStatsDTO with wrapCount, memberCount, bookingCount, totalRevenue
 * @throws Error if caller is not an admin or owner of the tenant
 */
export async function getTenantStats(
  tenantId: string,
  requestingUserId: string,
): Promise<TenantStatsDTO> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const [wrapCount, memberCount, bookingCount, revenueAggregate] = await Promise.all([
    prisma.wrap.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.tenantUserMembership.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.booking.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.invoice.aggregate({
      where: { tenantId, status: "paid", deletedAt: null },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;

  return {
    wrapCount,
    memberCount,
    bookingCount,
    totalRevenue,
    totalMembers: memberCount,
    totalBookings: bookingCount,
  };
}
