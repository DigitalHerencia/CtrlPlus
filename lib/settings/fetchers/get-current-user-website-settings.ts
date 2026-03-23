import 'server-only'

import { requireAuthzCapability } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'

import {
    createDefaultWebsiteSettingsInput,
    createWebsiteSettingsDTO,
    type WebsiteSettingsDTO,
} from '../types'

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
