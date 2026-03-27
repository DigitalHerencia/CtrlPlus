import 'server-only'

import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { invoiceListParamsSchema } from '@/schema/billing'
import {
    invoiceDTOFields,
    type InvoiceDTO,
    type InvoiceListParams,
    type InvoiceListResult,
} from '../types'
import { buildInvoiceReadWhere, getBillingAccessContext } from '../access'

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
