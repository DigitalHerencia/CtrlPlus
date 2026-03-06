import { prisma } from "@/lib/prisma";
import {
  type InvoiceDetailDTO,
  type InvoiceStatus,
  type PaymentStatus,
  invoiceDTOFields,
  lineItemDTOFields,
  paymentDTOFields,
} from "../types";

/**
 * Returns a single non-deleted invoice by ID, scoped to a tenant.
 * Includes all line items and payment records.
 * Returns null when not found or when it belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param invoiceId - Invoice primary key
 */
export async function getInvoiceById(
  tenantId: string,
  invoiceId: string
): Promise<InvoiceDetailDTO | null> {
  const record = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId, // defensive scope check
      deletedAt: null,
    },
    select: {
      ...invoiceDTOFields,
      lineItems: {
        select: lineItemDTOFields,
      },
      payments: {
        where: { deletedAt: null },
        select: paymentDTOFields,
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!record) return null;

  return {
    id: record.id,
    tenantId: record.tenantId,
    bookingId: record.bookingId,
    status: record.status as InvoiceStatus,
    totalAmount: record.totalAmount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    lineItems: record.lineItems.map((li: {
      id: string;
      invoiceId: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }) => ({
      id: li.id,
      invoiceId: li.invoiceId,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      totalPrice: li.totalPrice,
    })),
    payments: record.payments.map((p: {
      id: string;
      invoiceId: string;
      stripePaymentIntentId: string;
      status: string;
      amount: number;
      createdAt: Date;
    }) => ({
      id: p.id,
      invoiceId: p.invoiceId,
      stripePaymentIntentId: p.stripePaymentIntentId,
      status: p.status as PaymentStatus,
      amount: p.amount,
      createdAt: p.createdAt,
    })),
  };
}
