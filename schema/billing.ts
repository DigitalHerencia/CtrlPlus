import { z } from 'zod'

export const invoiceListParamsSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    status: z.enum(['draft', 'sent', 'paid', 'failed', 'refunded']).optional(),
})

export const ensureInvoiceForBookingSchema = z.object({
    bookingId: z.string().min(1),
})

export const createCheckoutSessionSchema = z.object({
    invoiceId: z.string().min(1),
})
