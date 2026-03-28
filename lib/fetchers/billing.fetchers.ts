import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db/prisma'
import { invoiceListParamsSchema } from '@/schema/billing'
import {
    invoiceDTOFields,
    invoiceLineItemDTOFields,
    paymentDTOFields,
    type InvoiceDTO,
    type InvoiceListParams,
    type InvoiceListResult,
    type InvoiceDetailDTO,
    type InvoiceLineItemDTO,
    type PaymentDTO,
} from '@/types/billing'
import { getBillingAccessContext } from '@/lib/authz/guards'

function buildInvoiceReadWhere(
    userId: string,
    canAccessAllInvoices: boolean
): Prisma.InvoiceWhereInput {
    if (canAccessAllInvoices) {
        return {}
    }

    return {
        booking: {
            customerId: userId,
        },
    }
}

function toInvoiceDTO(row: {
    id: string
    bookingId: string
    status: string
    totalAmount: number
    createdAt: Date
    updatedAt: Date
}): InvoiceDTO {
    return {
        id: row.id,
        bookingId: row.bookingId,
        status: row.status as InvoiceDTO['status'],
        totalAmount: row.totalAmount,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    }
}

export async function getInvoices(
    params: InvoiceListParams = { page: 1, pageSize: 20 }
): Promise<InvoiceListResult> {
    const access = await getBillingAccessContext()
    const { page, pageSize, status } = invoiceListParamsSchema.parse(params)
    const skip = (page - 1) * pageSize

    const where: Prisma.InvoiceWhereInput = {
        deletedAt: null,
        ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
        ...(status ? { status } : {}),
    }

    const [rows, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: invoiceDTOFields,
            skip,
            take: pageSize,
        }),
        prisma.invoice.count({ where }),
    ])

    return {
        invoices: rows.map(toInvoiceDTO),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

export async function getInvoiceById(invoiceId: string): Promise<InvoiceDetailDTO | null> {
    const access = await getBillingAccessContext()
    const row = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
            ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
        },
        select: {
            ...invoiceDTOFields,
            lineItems: {
                select: invoiceLineItemDTOFields,
                orderBy: { id: 'asc' },
            },
            payments: {
                where: { deletedAt: null },
                select: paymentDTOFields,
                orderBy: { createdAt: 'desc' },
            },
        },
    })

    if (!row) return null

    return {
        id: row.id,
        bookingId: row.bookingId,
        status: row.status as InvoiceDetailDTO['status'],
        totalAmount: row.totalAmount,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        lineItems: (
            row.lineItems as unknown as Array<{
                id: string
                description: string
                quantity: number
                unitPrice: number
                totalPrice: number
            }>
        ).map(
            (li): InvoiceLineItemDTO => ({
                id: li.id,
                description: li.description,
                quantity: li.quantity,
                unitPrice: li.unitPrice,
                totalPrice: li.totalPrice,
            })
        ),
        payments: (
            row.payments as Array<{
                id: string
                stripePaymentIntentId: string
                status: string
                amount: number
                createdAt: Date
            }>
        ).map(
            (p): PaymentDTO => ({
                id: p.id,
                stripePaymentIntentId: p.stripePaymentIntentId,
                status: p.status as PaymentDTO['status'],
                amount: p.amount,
                createdAt: p.createdAt,
                invoiceId,
            })
        ),
    }
}

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
            status: p.status as PaymentDTO['status'],
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
