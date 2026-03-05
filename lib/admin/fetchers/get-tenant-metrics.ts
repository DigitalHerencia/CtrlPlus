import {
  BookingStatus,
  InvoiceStatus,
  MembershipStatus,
  WrapStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertAdminOrOwner } from "../rbac";
import { type TenantMetricsDTO } from "../types";

// ─── Fetcher ──────────────────────────────────────────────────────────────────

/**
 * Returns aggregate metrics for the admin dashboard.
 *
 * Metrics include wrap counts, booking status breakdown, total paid revenue,
 * and active member count. Only accessible to ADMIN and OWNER roles.
 *
 * @param tenantId         - Tenant scope (server-side verified; never accept from client)
 * @param requestingUserId - Clerk user ID of the requesting user (RBAC check)
 * @returns TenantMetricsDTO with all aggregated counts and revenue
 */
export async function getTenantMetrics(
  tenantId: string,
  requestingUserId: string
): Promise<TenantMetricsDTO> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const [
    totalWraps,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalActiveMembers,
    revenueResult,
  ] = await Promise.all([
    prisma.wrap.count({
      where: { tenantId, status: WrapStatus.ACTIVE },
    }),
    prisma.booking.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.booking.count({
      where: { tenantId, status: BookingStatus.PENDING, deletedAt: null },
    }),
    prisma.booking.count({
      where: { tenantId, status: BookingStatus.CONFIRMED, deletedAt: null },
    }),
    prisma.booking.count({
      where: { tenantId, status: BookingStatus.COMPLETED, deletedAt: null },
    }),
    prisma.booking.count({
      where: { tenantId, status: BookingStatus.CANCELLED, deletedAt: null },
    }),
    prisma.tenantUserMembership.count({
      where: { tenantId, status: MembershipStatus.ACTIVE },
    }),
    prisma.invoice.aggregate({
      where: { tenantId, status: InvoiceStatus.PAID },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalWraps,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue: Number(revenueResult._sum.amount ?? 0),
    totalActiveMembers,
  };
}
