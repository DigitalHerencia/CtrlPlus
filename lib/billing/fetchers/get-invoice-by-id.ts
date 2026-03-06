import { prisma } from "@/lib/prisma";
import {
  invoiceDTOFields,
  invoiceLineItemDTOFields,
  paymentDTOFields,
  type InvoiceDetailDTO,
  type InvoiceLineItemDTO,
  type PaymentDTO,
} from "../types";

/**
 * Returns a single invoice with its line items and payment history, scoped to
 * the given tenant.  Returns null when the invoice does not exist or belongs to
 * a different tenant (prevents information disclosure).
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param invoiceId - Invoice ID to look up
 */
export async function getInvoiceById(
  tenantId: string,
  invoiceId: string,
): Promise<InvoiceDetailDTO | null> {
  const row = await prisma.invoice.findFirst({
    where: { id: invoiceId, tenantId, deletedAt: null },
    select: {
      ...invoiceDTOFields,
      lineItems: {
        select: invoiceLineItemDTOFields,
        orderBy: { id: "asc" },
      },
      payments: {
        where: { deletedAt: null },
        select: paymentDTOFields,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    bookingId: row.bookingId,
    status: row.status as InvoiceDetailDTO["status"],
    totalAmount: row.totalAmount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lineItems: (
      row.lineItems as Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>
    ).map(
      (li): InvoiceLineItemDTO => ({
        id: li.id,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        totalPrice: li.totalPrice,
      }),
    ),
    payments: (
      row.payments as Array<{
        id: string;
        stripePaymentIntentId: string;
        status: string;
        amount: number;
        createdAt: Date;
      }>
    ).map(
      (p): PaymentDTO => ({
        id: p.id,
        stripePaymentIntentId: p.stripePaymentIntentId,
        status: p.status as PaymentDTO["status"],
        amount: p.amount,
        createdAt: p.createdAt,
      }),
    ),
  };
}
