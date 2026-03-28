import type { Prisma, PrismaClient } from '@prisma/client'

type BillingWriter = PrismaClient | Prisma.TransactionClient

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
