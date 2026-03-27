import { prisma } from '@/lib/prisma'

export type CreateInvoiceParams = {
    tenantId: string
    bookingId: string
    customerId?: string | null
    amountCents: number
    currency?: string
    description?: string | null
}

/**
 * Billing manager - orchestrates billing flows used by admin actions.
 */
export const createInvoice = async (params: CreateInvoiceParams) => {
    const { bookingId, amountCents } = params

    const invoice = await prisma.invoice.create({
        data: {
            bookingId,
            totalAmount: amountCents,
            status: 'draft',
        },
    })

    return { invoiceId: invoice.id, status: invoice.status }
}
