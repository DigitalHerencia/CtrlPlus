import { z } from 'zod'

import { paginationParamsSchema } from '@/schemas/common.schemas'

export const invoiceListParamsSchema = paginationParamsSchema.extend({
    status: z.enum(['draft', 'sent', 'paid', 'failed', 'refunded']).optional(),
})

export const ensureInvoiceForBookingSchema = z.object({
    bookingId: z.string().min(1),
})

export const createCheckoutSessionSchema = z.object({
    invoiceId: z.string().min(1),
})
