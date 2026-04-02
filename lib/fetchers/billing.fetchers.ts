import 'server-only'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db/prisma'
import {
    invoiceDTOFields,
    invoiceLineItemDTOFields,
    paymentDTOFields,
} from '@/lib/db/selects/billing.selects'
import type {
    BillingBalanceDTO,
    InvoiceDTO,
    InvoiceListParams,
    InvoiceListResult,
    InvoiceDetailDTO,
    InvoiceLineItemDTO,
    PaymentDTO,
} from '@/types/billing.types'
import { getBillingAccessContext } from '@/lib/authz/guards'
import { type InvoiceStatus } from '@/lib/constants/statuses'

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

function normalizeInvoiceStatus(status: string): InvoiceStatus {
    if (status === 'sent') return 'issued'
    if (status === 'failed') return 'issued'
    if (
        status === 'draft' ||
        status === 'issued' ||
        status === 'paid' ||
        status === 'refunded' ||
        status === 'void'
    ) {
        return status
    }

    return 'draft'
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
        status: normalizeInvoiceStatus(row.status),
        totalAmount: row.totalAmount,
        subtotalAmount: row.totalAmount,
        taxAmount: null,
        dueDate: null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export async function getInvoices(
    params: InvoiceListParams = { page: 1, pageSize: 20 }
): Promise<InvoiceListResult> {
    const access = await getBillingAccessContext()
    // Validate params at the action boundary: invoiceListParamsSchema.parse(params)
    const { page, pageSize, status } = params
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
        status: normalizeInvoiceStatus(row.status),
        totalAmount: row.totalAmount,
        subtotalAmount: row.totalAmount,
        taxAmount: null,
        dueDate: null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        paymentHistory: (
            row.payments as Array<{
                id: string
                stripePaymentIntentId: string
                status: string
                amount: number
                createdAt: Date
            }>
        ).map((p) => ({
            id: p.id,
            type: p.amount < 0 ? ('refund' as const) : ('payment' as const),
            amount: p.amount,
            createdAt: p.createdAt.toISOString(),
            providerReference: p.stripePaymentIntentId,
            notes: p.status,
        })),
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
                createdAt: p.createdAt.toISOString(),
                invoiceId,
            })
        ),
    }
}

export async function getInvoice(
    invoiceId: string,
    _userId?: string
): Promise<InvoiceDetailDTO | null> {
    void _userId
    return getInvoiceById(invoiceId)
}

export async function getBalance(_tenantId?: string): Promise<BillingBalanceDTO> {
    void _tenantId
    const access = await getBillingAccessContext()

    const invoiceWhere: Prisma.InvoiceWhereInput = {
        deletedAt: null,
        ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
    }

    const [invoices, payments] = await Promise.all([
        prisma.invoice.findMany({
            where: invoiceWhere,
            select: { totalAmount: true, status: true },
        }),
        prisma.payment.findMany({
            where: {
                deletedAt: null,
                invoice: invoiceWhere,
            },
            select: { amount: true },
        }),
    ])

    const outstandingAmount = invoices
        .filter((invoice) => {
            const status = normalizeInvoiceStatus(invoice.status)
            return status === 'draft' || status === 'issued'
        })
        .reduce((sum, invoice) => sum + invoice.totalAmount, 0)

    const creditAmount = Math.abs(
        payments
            .filter((payment) => payment.amount < 0)
            .reduce((sum, payment) => sum + payment.amount, 0)
    )

    return {
        outstandingAmount,
        creditAmount,
        currency: 'usd',
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
            createdAt: p.createdAt.toISOString(),
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
