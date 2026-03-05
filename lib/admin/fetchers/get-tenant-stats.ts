/**
 * Admin Fetcher – Tenant Statistics
 *
 * Returns aggregate metrics for the admin dashboard overview card.
 * All queries are scoped by tenantId (never cross-tenant data).
 */

import { prisma } from "@/lib/prisma";
import type { TenantStats } from "../types";

/** Shape returned by the Prisma stub for aggregate queries */
interface AggregateResult {
  _sum: { amountCents: number | null };
}

/**
 * Fetches aggregate statistics for the given tenant's dashboard.
 *
 * @param tenantId - Server-side resolved tenant scope
 * @returns TenantStats DTO
 */
export async function getTenantStats(tenantId: string): Promise<TenantStats> {
  const [totalWraps, totalBookings, pendingBookings, revenue, totalMembers] =
    await Promise.all([
      prisma.wrap.count({
        where: { tenantId, deletedAt: null },
      }) as Promise<number>,
      prisma.booking.count({ where: { tenantId } }) as Promise<number>,
      prisma.booking.count({
        where: { tenantId, status: "PENDING" },
      }) as Promise<number>,
      prisma.invoice.aggregate({
        where: { tenantId, status: "PAID" },
        _sum: { amountCents: true },
      }) as Promise<AggregateResult>,
      prisma.tenantUserMembership.count({
        where: { tenantId, status: "ACTIVE" },
      }) as Promise<number>,
    ]);

  return {
    totalWraps: totalWraps ?? 0,
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    totalRevenue: (revenue?._sum?.amountCents ?? 0) / 100,
    totalMembers: totalMembers ?? 0,
  };
}
