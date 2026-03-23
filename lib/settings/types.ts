import { z } from 'zod'

const DEFAULT_TIMEZONE = process.env.DEFAULT_STORE_TIMEZONE ?? 'America/Denver'

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

export type WebsiteSettingsInput = z.infer<typeof websiteSettingsSchema>

export interface WebsiteSettingsDTO {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
    updatedAt: string | null
}

export function createDefaultWebsiteSettingsInput(): WebsiteSettingsInput {
    return {
        preferredContact: 'email',
        appointmentReminders: true,
        marketingOptIn: false,
        timezone: DEFAULT_TIMEZONE,
    }
}

export function createWebsiteSettingsDTO(
    input: WebsiteSettingsInput,
    updatedAt: Date | string | null
): WebsiteSettingsDTO {
    return {
        preferredContact: input.preferredContact,
        appointmentReminders: input.appointmentReminders,
        marketingOptIn: input.marketingOptIn,
        timezone: input.timezone,
        updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    }
}
