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
