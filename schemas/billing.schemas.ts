import { z } from 'zod'

import { paginationParamsSchema } from '@/schemas/common.schemas'

export const invoiceListParamsSchema = paginationParamsSchema.extend({
    status: z.enum(['draft', 'issued', 'paid', 'refunded', 'void']).optional(),
    query: z.string().trim().max(120).optional(),
})

export const invoiceFilterFormSchema = z.object({
    query: z.string().trim().max(200, 'Search must be 200 characters or fewer.'),
    invoiceId: z.string().trim().max(64).default(''),
    sortBy: z.enum(['createdAt', 'name', 'price']),
})

export const createInvoiceSchema = z.object({
    bookingId: z.string().min(1),
    tenantId: z.string().min(1).optional(),
})

export const ensureInvoiceForBookingSchema = createInvoiceSchema.pick({
    bookingId: true,
})

export const createCheckoutSessionSchema = z.object({
    invoiceId: z.string().min(1),
})

export const processPaymentSchema = z.object({
    invoiceId: z.string().min(1),
})

export const applyCreditSchema = z.object({
    invoiceId: z.string().min(1),
    amount: z.number().int().positive(),
    notes: z.string().max(500).optional(),
})

export const voidInvoiceSchema = z.object({
    invoiceId: z.string().min(1),
    notes: z.string().max(500).optional(),
})

export const refundInvoiceSchema = z.object({
    invoiceId: z.string().min(1),
    amount: z.number().int().positive().optional(),
    notes: z.string().max(500).optional(),
})
