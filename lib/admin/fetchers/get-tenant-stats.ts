import { prisma } from "@/lib/prisma";
import { type TenantStatsDTO } from "../types";

/**
 * Aggregates dashboard metrics for a tenant.
 *
 * Returns total active members, total non-deleted bookings, and total revenue
 * from paid invoices.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns TenantStatsDTO with aggregated metrics
 */
export async function getTenantStats(tenantId: string): Promise<TenantStatsDTO> {
  const [totalMembers, totalBookings, revenueResult] = await Promise.all([
    prisma.tenantUserMembership.count({
      where: {
        tenantId,
        deletedAt: null,
      },
    }),
    prisma.booking.count({
      where: {
        tenantId,
        deletedAt: null,
      },
    }),
    prisma.invoice.aggregate({
      where: {
        tenantId,
        status: "paid",
        deletedAt: null,
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  return {
    totalMembers,
    totalBookings,
    totalRevenue: revenueResult._sum.totalAmount ?? 0,
  };
}
