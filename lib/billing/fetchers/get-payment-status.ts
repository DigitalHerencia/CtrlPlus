import { prisma } from '@/lib/prisma'
import { type PaymentDTO, type PaymentStatus, paymentDTOFields } from '../types'

export async function getPaymentStatusForInvoice(invoiceId: string): Promise<PaymentDTO[] | null> {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
        },
        select: { id: true },
    })

    if (!invoice) return null

    const payments = await prisma.payment.findMany({
        where: {
            invoiceId,
            deletedAt: null,
        },
        select: paymentDTOFields,
        orderBy: { createdAt: 'asc' },
    })

    return payments.map(
        (p: {
            id: string
            invoiceId: string
            stripePaymentIntentId: string
            status: string
            amount: number
            createdAt: Date
        }) => ({
            id: p.id,
            invoiceId: p.invoiceId,
            stripePaymentIntentId: p.stripePaymentIntentId,
            status: p.status as PaymentStatus,
            amount: p.amount,
            createdAt: p.createdAt,
        })
    )
}
