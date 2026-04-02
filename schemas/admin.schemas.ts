import { z } from 'zod'

const dateStringSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid date string',
})

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

export const tenantMetricsFilterSchema = z
    .object({
        tenantId: z.string().min(1),
        startDate: dateStringSchema.nullish(),
        endDate: dateStringSchema.nullish(),
    })
    .refine(
        (input) => {
            if (!input.startDate || !input.endDate) {
                return true
            }

            return Date.parse(input.startDate) <= Date.parse(input.endDate)
        },
        {
            message: 'startDate must be before or equal to endDate',
            path: ['startDate'],
        }
    )

export const auditLogFilterSchema = z
    .object({
        tenantId: z.string().min(1),
        actorId: z.string().min(1).nullish(),
        eventType: z.string().min(1).nullish(),
        resourceType: z.string().min(1).nullish(),
        startDate: dateStringSchema.nullish(),
        endDate: dateStringSchema.nullish(),
        limit: z.number().int().min(1).max(200).default(50),
    })
    .refine(
        (input) => {
            if (!input.startDate || !input.endDate) {
                return true
            }

            return Date.parse(input.startDate) <= Date.parse(input.endDate)
        },
        {
            message: 'startDate must be before or equal to endDate',
            path: ['startDate'],
        }
    )

export const flagContentSchema = z.object({
    tenantId: z.string().min(1),
    resourceType: z.string().min(1),
    resourceId: z.string().min(1),
    reason: z.string().min(3).max(500),
})

export const resolveFlagSchema = z.object({
    tenantId: z.string().min(1),
    flagId: z.string().min(1),
    action: z.enum(['approve', 'dismiss', 'hide', 'delete']),
})
