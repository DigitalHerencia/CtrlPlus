import { z } from 'zod'

import { DEFAULT_STORE_TIMEZONE } from '@/lib/constants/app'
import {
    STANDARD_APPOINTMENT_DURATION_MINUTES,
    STANDARD_APPOINTMENT_END_HOUR,
    STANDARD_APPOINTMENT_START_HOUR,
} from '@/lib/constants/scheduling'
import { paginationParamsSchema } from '@/schemas/common.schemas'

const WEEKDAY_SHORT_TO_INDEX: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
}

function getStoreTimeParts(date: Date): { weekday: number; hour: number; minute: number } | null {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: DEFAULT_STORE_TIMEZONE,
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).formatToParts(date)

        const weekdayStr = parts.find((p) => p.type === 'weekday')?.value
        const hourStr = parts.find((p) => p.type === 'hour')?.value
        const minuteStr = parts.find((p) => p.type === 'minute')?.value

        const weekday = weekdayStr !== undefined ? WEEKDAY_SHORT_TO_INDEX[weekdayStr] : undefined
        const hour = hourStr !== undefined ? Number(hourStr) : NaN
        const minute = minuteStr !== undefined ? Number(minuteStr) : NaN

        if (weekday === undefined || Number.isNaN(hour) || Number.isNaN(minute)) {
            return null
        }

        return { weekday, hour, minute }
    } catch {
        return null
    }
}

function isStandardAppointmentRange(startTime: Date, endTime: Date): boolean {
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (60 * 1000)
    if (durationMinutes !== STANDARD_APPOINTMENT_DURATION_MINUTES) {
        return false
    }

    const start = getStoreTimeParts(startTime)
    const end = getStoreTimeParts(endTime)

    if (!start || !end) {
        return false
    }

    // Mon–Fri only (1–5)
    if (start.weekday < 1 || start.weekday > 5 || end.weekday < 1 || end.weekday > 5) {
        return false
    }

    // On the hour only
    if (start.minute !== 0 || end.minute !== 0) {
        return false
    }

    // Start within business window
    if (
        start.hour < STANDARD_APPOINTMENT_START_HOUR ||
        start.hour >= STANDARD_APPOINTMENT_END_HOUR
    ) {
        return false
    }

    // End is exactly 1 hour after start, same day
    if (end.hour !== start.hour + 1 || end.weekday !== start.weekday) {
        return false
    }

    return true
}

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
    .refine((data) => isStandardAppointmentRange(data.startTime, data.endTime), {
        message:
            'Appointments must be Monday-Friday, on the hour, and exactly 1 hour between 8:00 AM and 6:00 PM',
        path: ['startTime'],
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
    .refine((data) => isStandardAppointmentRange(data.startTime, data.endTime), {
        message:
            'Appointments must be Monday-Friday, on the hour, and exactly 1 hour between 8:00 AM and 6:00 PM',
        path: ['startTime'],
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
        customerPhone: z.string().trim().max(40).optional().default(''),
        preferredContact: z.enum(['email', 'sms']).default('email'),
        billingAddressLine1: z.string().trim().max(200).optional().default(''),
        billingAddressLine2: z.string().trim().max(200).optional().default(''),
        billingCity: z.string().trim().max(120).optional().default(''),
        billingState: z.string().trim().max(120).optional().default(''),
        billingPostalCode: z.string().trim().max(40).optional().default(''),
        billingCountry: z.string().trim().max(120).optional().default(''),
        vehicleMake: z.string().trim().max(120).optional().default(''),
        vehicleModel: z.string().trim().max(120).optional().default(''),
        vehicleYear: z
            .string()
            .trim()
            .refine((value) => value.length === 0 || /^\d{4}$/.test(value), {
                message: 'Year must be a 4-digit value.',
            })
            .optional()
            .default(''),
        vehicleTrim: z.string().trim().optional().default(''),
        previewImageUrl: z.url().trim().optional().or(z.literal('')),
        previewPromptUsed: z.string().trim().max(4000).optional().default(''),
        notes: z.string().trim().max(1000).optional().default(''),
    })
    .refine((values) => values.windowId.length > 0, {
        message: 'Select a time slot.',
        path: ['windowId'],
    })

export const createBookingSchema = z
    .object({
        wrapId: z.string().trim().min(1, 'Wrap is required').nullable().optional(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
        customerName: z.string().trim().min(1, 'Full name is required.'),
        customerEmail: z.email().trim().max(320),
        customerPhone: z.string().trim().max(40).nullable().optional(),
        preferredContact: z.enum(['email', 'sms']).default('email'),
        billingAddressLine1: z.string().trim().max(200).nullable().optional(),
        billingAddressLine2: z.string().trim().max(200).nullable().optional(),
        billingCity: z.string().trim().max(120).nullable().optional(),
        billingState: z.string().trim().max(120).nullable().optional(),
        billingPostalCode: z.string().trim().max(40).nullable().optional(),
        billingCountry: z.string().trim().max(120).nullable().optional(),
        vehicleMake: z.string().trim().max(120).nullable().optional(),
        vehicleModel: z.string().trim().max(120).nullable().optional(),
        vehicleYear: z
            .string()
            .trim()
            .refine((value) => value.length === 0 || /^\d{4}$/.test(value), {
                message: 'Year must be a 4-digit value.',
            })
            .nullable()
            .optional(),
        vehicleTrim: z.string().trim().nullable().optional(),
        previewImageUrl: z.url().trim().nullable().optional(),
        previewPromptUsed: z.string().trim().max(4000).nullable().optional(),
        notes: z.string().trim().max(1000).nullable().optional(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })
    .refine((data) => isStandardAppointmentRange(data.startTime, data.endTime), {
        message:
            'Appointments must be Monday-Friday, on the hour, and exactly 1 hour between 8:00 AM and 6:00 PM',
        path: ['startTime'],
    })
