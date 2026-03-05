import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  invoiceListParamsSchema,
  type InvoiceDTO,
  type InvoiceListParams,
  type InvoiceListResult,
  type PaymentStatusDTO,
  type InvoiceCountByStatusDTO,
} from "../types";

/**
 * Maps a raw Prisma Invoice record to an InvoiceDTO.
 * Converts Decimal amount to string to preserve precision;
 * never exposes internal/unintended fields.
 */
function toInvoiceDTO(record: {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: { toString(): string };
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): InvoiceDTO {
  return {
    id: record.id,
    tenantId: record.tenantId,
    bookingId: record.bookingId,
    amount: record.amount.toString(),
    status: record.status,
    stripeCheckoutSessionId: record.stripeCheckoutSessionId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const invoiceSelectFields = {
  id: true,
  tenantId: true,
  bookingId: true,
  amount: true,
  status: true,
  stripeCheckoutSessionId: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Returns a paginated list of invoices for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param params   - Optional filter / pagination options (defaults applied via schema)
 */
export async function getInvoicesForTenant(
  tenantId: string,
  rawParams: Partial<InvoiceListParams> = {}
): Promise<InvoiceListResult> {
  const { page, pageSize, status } = invoiceListParamsSchema.parse(rawParams);
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    ...(status !== undefined && { status }),
  };

  const [records, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      select: invoiceSelectFields,
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

/**
 * Returns a single invoice by ID, scoped to a tenant.
 * Returns null when not found or when it belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param invoiceId - Invoice primary key
 */
export async function getInvoiceById(
  tenantId: string,
  invoiceId: string
): Promise<InvoiceDTO | null> {
  const record = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId, // defensive scope check
    },
    select: invoiceSelectFields,
  });

  return record ? toInvoiceDTO(record) : null;
}

/**
 * Returns the payment status information for a single invoice,
 * scoped to a tenant.
 * Returns null when not found or when it belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param invoiceId - Invoice primary key
 */
export async function getPaymentStatus(
  tenantId: string,
  invoiceId: string
): Promise<PaymentStatusDTO | null> {
  const record = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId, // defensive scope check
    },
    select: {
      id: true,
      status: true,
      stripeCheckoutSessionId: true,
      updatedAt: true,
    },
  });

  if (!record) return null;

  return {
    invoiceId: record.id,
    status: record.status,
    stripeCheckoutSessionId: record.stripeCheckoutSessionId,
    updatedAt: record.updatedAt,
  };
}

/**
 * Returns the count of invoices grouped by status for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 */
export async function getInvoiceCountByStatus(
  tenantId: string
): Promise<InvoiceCountByStatusDTO[]> {
  const groups = await prisma.invoice.groupBy({
    by: ["status"],
    where: { tenantId },
    _count: { id: true },
  });

  return groups.map((g) => ({
    status: g.status,
    count: g._count.id,
  }));
}
