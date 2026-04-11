/**
 * @introduction Db — TODO: short one-line summary of billing.transactions.ts
 *
 * @description TODO: longer description for billing.transactions.ts. Keep it short — one or two sentences.
 * Domain: db
 * Public: TODO (yes/no)
 */
import type { Prisma, PrismaClient } from '@prisma/client'

type BillingWriter = PrismaClient | Prisma.TransactionClient

/**
 * CreateAdminInvoiceParams — TODO: brief description of this type.
 */
export interface CreateAdminInvoiceParams {
    bookingId: string
    amountCents: number
}

export async function createAdminInvoice(
    db: BillingWriter,
    params: CreateAdminInvoiceParams
): Promise<{ invoiceId: string; status: string }> {
    const invoice = await db.invoice.create({
        data: {
            bookingId: params.bookingId,
            totalAmount: params.amountCents,
            status: 'draft',
        },
    })

    return {
        invoiceId: invoice.id,
        status: invoice.status,
    }
}
