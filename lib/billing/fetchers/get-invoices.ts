import { prisma } from '@/lib/prisma'
import {
    invoiceDTOFields,
    invoiceListParamsSchema,
    type InvoiceDTO,
    type InvoiceListParams,
    type InvoiceListResult,
} from '../types'

interface InvoiceScope {
    customerId?: string
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
    params: InvoiceListParams = { page: 1, pageSize: 20 },
    scope: InvoiceScope = {}
): Promise<InvoiceListResult> {
    const { page, pageSize, status } = invoiceListParamsSchema.parse(params)
    const skip = (page - 1) * pageSize

    const where = {
        deletedAt: null,
        ...(scope.customerId
            ? {
                  booking: {
                      customerId: scope.customerId,
                  },
              }
            : {}),
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
