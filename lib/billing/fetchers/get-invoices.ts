import { prisma } from "@/lib/prisma";
import {
  type InvoiceDTO,
  type InvoiceListParams,
  type InvoiceListResult,
  type InvoiceStatus,
  invoiceDTOFields,
} from "../types";

const DEFAULT_INVOICE_LIST_PARAMS: InvoiceListParams = {
  page: 1,
  pageSize: 20,
};

/**
 * Maps a raw Prisma Invoice record to an InvoiceDTO.
 * Never exposes deletedAt or other internal fields.
 */
function toInvoiceDTO(record: {
  id: string;
  tenantId: string;
  bookingId: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}): InvoiceDTO {
  return {
    id: record.id,
    tenantId: record.tenantId,
    bookingId: record.bookingId,
    status: record.status as InvoiceStatus,
    totalAmount: record.totalAmount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Returns a paginated list of non-deleted invoices for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param params   - Optional filter / pagination options
 */
export async function getInvoicesForTenant(
  tenantId: string,
  params: InvoiceListParams = DEFAULT_INVOICE_LIST_PARAMS
): Promise<InvoiceListResult> {
  const { page, pageSize, status } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    deletedAt: null, // soft-delete filter
    ...(status !== undefined && { status }),
  };

  const [records, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      select: invoiceDTOFields,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    items: records.map(toInvoiceDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
