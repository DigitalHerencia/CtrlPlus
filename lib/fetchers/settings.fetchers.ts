import 'server-only'
import { requireAuthzCapability } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { type WebsiteSettingsDTO, type WebsiteSettingsInput } from '@/types/settings.types'
import { DEFAULT_STORE_TIMEZONE } from '@/lib/constants/app'

export function createDefaultWebsiteSettingsInput(): WebsiteSettingsInput {
    return {
        preferredContact: 'email',
        appointmentReminders: true,
        marketingOptIn: false,
        timezone: DEFAULT_STORE_TIMEZONE,
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

export async function getCurrentUserWebsiteSettings(): Promise<WebsiteSettingsDTO> {
    const session = await requireAuthzCapability('settings.manage.own')

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const settings = await prisma.websiteSettings.findFirst({
        where: {
            clerkUserId: session.userId,
            deletedAt: null,
        },
        select: {
            preferredContact: true,
            appointmentReminders: true,
            marketingOptIn: true,
            timezone: true,
            updatedAt: true,
        },
    })

    if (!settings) {
        return createWebsiteSettingsDTO(createDefaultWebsiteSettingsInput(), null)
    }

    return createWebsiteSettingsDTO(
        {
            preferredContact: settings.preferredContact as 'email' | 'sms',
            appointmentReminders: settings.appointmentReminders,
            marketingOptIn: settings.marketingOptIn,
            timezone: settings.timezone,
        },
        settings.updatedAt
    )
}
