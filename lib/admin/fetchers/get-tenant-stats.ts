import { prisma } from "@/lib/prisma";
import { type TenantStatsDTO } from "../types";

// ─── Select helpers ───────────────────────────────────────────────────────────

const invoiceRevenueFields = {
  totalAmount: true,
} as const;

// ─── Fetcher ──────────────────────────────────────────────────────────────────

/**
 * Returns aggregated dashboard metrics for a tenant.
 *
 * All counts are scoped to active (non-deleted) records only.
 * Revenue is the sum of `totalAmount` for all invoices with status "paid".
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns TenantStatsDTO with wrapCount, memberCount, bookingCount, totalRevenue
 */
export async function getTenantStats(tenantId: string): Promise<TenantStatsDTO> {
  const [wrapCount, memberCount, bookingCount, paidInvoices] = await Promise.all([
    prisma.wrap.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.tenantUserMembership.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.booking.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.invoice.findMany({
      where: { tenantId, status: "paid", deletedAt: null },
      select: invoiceRevenueFields,
    }),
  ]);

  const totalRevenue = paidInvoices.reduce(
    (sum: number, inv: { totalAmount: number }) => sum + inv.totalAmount,
    0,
  );

  return { wrapCount, memberCount, bookingCount, totalRevenue };
}
