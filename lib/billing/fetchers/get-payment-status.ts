import { prisma } from "@/lib/prisma";
import { type PaymentDTO, type PaymentStatus, paymentDTOFields } from "../types";

/**
 * Returns all non-deleted payment records for a given invoice, scoped to a
 * tenant via the parent invoice's tenantId.
 * Returns null when the invoice is not found or belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param invoiceId - Invoice primary key
 */
export async function getPaymentStatusForInvoice(
  tenantId: string,
  invoiceId: string,
): Promise<PaymentDTO[] | null> {
  // Verify the invoice exists and belongs to this tenant
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId, // defensive scope check
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!invoice) return null;

  const payments = await prisma.payment.findMany({
    where: {
      invoiceId,
      deletedAt: null,
    },
    select: paymentDTOFields,
    orderBy: { createdAt: "asc" },
  });

  return payments.map(
    (p: {
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
    }),
  );
}
