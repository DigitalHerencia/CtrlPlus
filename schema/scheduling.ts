import { z } from 'zod'

export const bookingListParamsSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
})

export const availabilityListParamsSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
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
        startTime: z.date(),
        endTime: z.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })

export const bookingFormSchema = z
    .object({
        date: z.date({ error: 'Select a date.' }),
        windowId: z.string().min(1, 'Select a time slot.'),
        wrapId: z.string().min(1, 'Select a wrap service.'),
    })
    .refine((values) => values.windowId.length > 0, {
        message: 'Select a time slot.',
        path: ['windowId'],
    })
