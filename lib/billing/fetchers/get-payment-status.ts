import 'server-only'

import { prisma } from '@/lib/prisma'
import { type PaymentDTO, type PaymentStatus, paymentDTOFields } from '../types'
import { buildInvoiceReadWhere, getBillingAccessContext } from '../access'

export async function getPaymentStatusForInvoice(invoiceId: string): Promise<PaymentDTO[] | null> {
    const access = await getBillingAccessContext()

    const rows = await prisma.payment.findMany({
        where: {
            deletedAt: null,
            invoice: {
                id: invoiceId,
                deletedAt: null,
                ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
            },
        },
        select: paymentDTOFields,
        orderBy: { createdAt: 'asc' },
    })

    const payments = rows.map(
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

    if (payments.length > 0) {
        return payments
    }

    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
            ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
        },
        select: { id: true },
    })

    return invoice ? [] : null
}
