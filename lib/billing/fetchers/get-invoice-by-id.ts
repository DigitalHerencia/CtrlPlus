import { prisma } from "@/lib/prisma";
import {
  invoiceDTOFields,
  invoiceLineItemDTOFields,
  paymentDTOFields,
  type InvoiceDetailDTO,
  type InvoiceLineItemDTO,
  type PaymentDTO,
} from "../types";

interface InvoiceScope {
  customerId?: string;
}

export async function getInvoiceById(
  invoiceId: string,
  scope: InvoiceScope = {},
): Promise<InvoiceDetailDTO | null> {
  const row = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      deletedAt: null,
      ...(scope.customerId
        ? {
            booking: {
              customerId: scope.customerId,
            },
          }
        : {}),
    },
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
    bookingId: row.bookingId,
    status: row.status as InvoiceDetailDTO["status"],
    totalAmount: row.totalAmount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lineItems: (
      row.lineItems as unknown as Array<{
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
        invoiceId,
      }),
    ),
  };
}
