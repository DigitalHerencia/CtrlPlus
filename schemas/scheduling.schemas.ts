import { z } from 'zod'

import { paginationParamsSchema } from '@/schemas/common.schemas'

export const bookingListParamsSchema = paginationParamsSchema.extend({
    status: z
        .enum(['requested', 'confirmed', 'reschedule_requested', 'completed', 'cancelled'])
        .optional(),
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
        customerName: z.string().trim().min(1, 'Full name is required.'),
        customerEmail: z.email().trim().max(320),
        customerPhone: z.string().trim().min(7, 'Phone is required.'),
        preferredContact: z.enum(['email', 'sms']),
        billingAddressLine1: z.string().trim().min(1, 'Billing address is required.'),
        billingAddressLine2: z.string().trim().max(200).optional().default(''),
        billingCity: z.string().trim().min(1, 'City is required.'),
        billingState: z.string().trim().min(1, 'State is required.'),
        billingPostalCode: z.string().trim().min(1, 'Postal code is required.'),
        billingCountry: z.string().trim().min(1, 'Country is required.'),
        vehicleMake: z.string().trim().min(1, 'Vehicle make is required.'),
        vehicleModel: z.string().trim().min(1, 'Vehicle model is required.'),
        vehicleYear: z.string().trim().regex(/^\d{4}$/, 'Year must be a 4-digit value.'),
        vehicleTrim: z.string().trim().optional().default(''),
        previewImageUrl: z.url().trim().optional().or(z.literal('')),
        previewPromptUsed: z.string().trim().max(4000).optional().default(''),
        notes: z.string().trim().max(1000).optional().default(''),
    })
    .refine((values) => values.windowId.length > 0, {
        message: 'Select a time slot.',
        path: ['windowId'],
    })

export const createBookingSchema = reserveSlotSchema.extend({
    customerName: z.string().trim().min(1, 'Full name is required.'),
    customerEmail: z.email().trim().max(320),
    customerPhone: z.string().trim().min(7, 'Phone is required.').nullable().optional(),
    preferredContact: z.enum(['email', 'sms']),
    billingAddressLine1: z.string().trim().min(1, 'Billing address is required.'),
    billingAddressLine2: z.string().trim().max(200).nullable().optional(),
    billingCity: z.string().trim().min(1, 'City is required.'),
    billingState: z.string().trim().min(1, 'State is required.'),
    billingPostalCode: z.string().trim().min(1, 'Postal code is required.'),
    billingCountry: z.string().trim().min(1, 'Country is required.'),
    vehicleMake: z.string().trim().min(1, 'Vehicle make is required.'),
    vehicleModel: z.string().trim().min(1, 'Vehicle model is required.'),
    vehicleYear: z.string().trim().regex(/^\d{4}$/, 'Year must be a 4-digit value.'),
    vehicleTrim: z.string().trim().nullable().optional(),
    previewImageUrl: z.url().trim().nullable().optional(),
    previewPromptUsed: z.string().trim().max(4000).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
})
