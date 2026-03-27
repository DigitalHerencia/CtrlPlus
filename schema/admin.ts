import { z } from 'zod'

export const createInvoiceSchema = z.object({
    tenantId: z.string().min(1),
    bookingId: z.string().min(1),
    customerId: z.string().optional(),
    amountCents: z.number().int().positive(),
    currency: z.string().optional(),
    description: z.string().optional(),
})

export const confirmAppointmentSchema = z.object({
    tenantId: z.string().min(1),
    bookingId: z.string().min(1),
    status: z.enum(['confirmed', 'cancelled', 'rescheduled']),
    note: z.string().optional(),
})
