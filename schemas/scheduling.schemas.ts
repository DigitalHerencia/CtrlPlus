import { z } from 'zod'

import { paginationParamsSchema } from '@/schemas/common.schemas'

export const bookingListParamsSchema = paginationParamsSchema.extend({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    // Coerce query params into dates for server-side parsing
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
})

export const availabilityQuerySchema = z
    .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: 'End date must be on or after start date',
        path: ['endDate'],
    })

export const reserveSlotSchema = z
    .object({
        wrapId: z.string().min(1, 'Wrap is required'),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })

export const updateBookingSchema = z
    .object({
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })

export const cancelBookingSchema = z.object({
    reason: z.string().trim().min(3, 'Cancellation reason is required'),
})

export const bookingFormSchema = z
    .object({
        // coerce client-provided date strings to Date on the server-side
        date: z.coerce.date(),
        windowId: z.string().min(1, 'Select a time slot.'),
        wrapId: z.string().min(1, 'Select a wrap service.'),
    })
    .refine((values) => values.windowId.length > 0, {
        message: 'Select a time slot.',
        path: ['windowId'],
    })
