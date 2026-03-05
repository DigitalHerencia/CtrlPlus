import { prisma } from "@/lib/prisma";
import { type InvoiceDTO } from "../types";

/**
 * Fetches all invoices for a tenant, ordered by most-recently created.
 *
 * @param tenantId - Tenant scope (server-side verified, never client-supplied)
 * @returns Array of InvoiceDTO
 */
export async function getInvoicesForTenant(
  tenantId: string
): Promise<InvoiceDTO[]> {
  const records = await prisma.invoice.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });

  return records.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    bookingId: r.bookingId,
    amount: r.amount,
    status: r.status,
    stripeCheckoutSessionId: r.stripeCheckoutSessionId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

/**
 * Fetches a single invoice by ID, scoped to the tenant.
 * Returns null when no match is found (cross-tenant access is silently denied).
 *
 * @param tenantId - Tenant scope
 * @param invoiceId - Invoice primary key
 * @returns InvoiceDTO or null
 */
export async function getInvoiceById(
  tenantId: string,
  invoiceId: string
): Promise<InvoiceDTO | null> {
  const record = await prisma.invoice.findFirst({
    where: { id: invoiceId, tenantId },
  });

  if (!record) return null;

  return {
    id: record.id,
    tenantId: record.tenantId,
    bookingId: record.bookingId,
    amount: record.amount,
    status: record.status,
    stripeCheckoutSessionId: record.stripeCheckoutSessionId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
