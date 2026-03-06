import { prisma } from "@/lib/prisma";
import {
  invoiceDTOFields,
  type InvoiceDTO,
  type InvoiceListParams,
  type InvoiceListResult,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toInvoiceDTO(row: {
  id: string;
  tenantId: string;
  bookingId: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}): InvoiceDTO {
  return {
    id: row.id,
    tenantId: row.tenantId,
    bookingId: row.bookingId,
    status: row.status as InvoiceDTO["status"],
    totalAmount: row.totalAmount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Returns all non-deleted invoices for a tenant, ordered newest first.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @param params   - Optional status filter and pagination
 */
export async function getInvoicesForTenant(
  tenantId: string,
  params: InvoiceListParams = { page: 1, pageSize: 20 },
): Promise<InvoiceListResult> {
  const { page, pageSize, status } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    deletedAt: null,
    ...(status ? { status } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: invoiceDTOFields,
      skip,
      take: pageSize,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    invoices: rows.map(toInvoiceDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
