import { z } from 'zod'

function isValidIanaTimezone(value: string): boolean {
    try {
        Intl.DateTimeFormat('en-US', { timeZone: value })
        return true
    } catch {
        return false
    }
}

export const websiteSettingsSchema = z.object({
    preferredContact: z.enum(['email', 'sms']).default('email'),
    appointmentReminders: z.boolean().default(true),
    marketingOptIn: z.boolean().default(false),
    timezone: z
        .string()
        .trim()
        .min(1, 'Timezone is required.')
        .max(100, 'Timezone must be 100 characters or fewer.')
        .refine(isValidIanaTimezone, 'Use a valid IANA timezone identifier.'),
})

export const notificationPreferencesSchema = z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(false),
})

export const updateUserPreferencesSchema = z
    .object({
        theme: z.enum(['light', 'dark', 'system']).nullable().optional(),
        language: z.string().trim().max(30).nullable().optional(),
        timezone: z
            .string()
            .trim()
            .min(1)
            .max(100)
            .refine(isValidIanaTimezone, 'Use a valid IANA timezone identifier.')
            .nullable()
            .optional(),
        fullName: z.string().trim().max(200).nullable().optional(),
        email: z.email().trim().max(320).nullable().optional(),
        phone: z.string().trim().max(40).nullable().optional(),
        notifications: notificationPreferencesSchema.partial().optional(),
        preferredContact: z.enum(['email', 'sms']).optional(),
        appointmentReminders: z.boolean().optional(),
        marketingOptIn: z.boolean().optional(),
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
            .regex(/^\d{4}$/, 'Year must be a 4-digit value.')
            .nullable()
            .optional(),
        vehicleTrim: z.string().trim().max(120).nullable().optional(),
    })
    .strict()

export const updateTenantSettingsSchema = z
    .object({
        businessName: z.string().trim().max(200).nullable().optional(),
        address: z.string().trim().max(400).nullable().optional(),
        taxId: z.string().trim().max(100).nullable().optional(),
        notificationEmail: z.email().trim().max(320).nullable().optional(),
        logoUrl: z.url().trim().max(2048).nullable().optional(),
    })
    .strict()

export const exportDataSchema = z
    .object({
        tenantId: z.string().trim().min(1),
        format: z.enum(['json', 'csv']),
    })
    .strict()
