'use server'

import { requireAuthzCapability } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { websiteSettingsSchema } from '@/schemas/settings.schemas'
import { type WebsiteSettingsDTO, type WebsiteSettingsInput } from '@/types/settings.types'
import { createWebsiteSettingsDTO } from '@/lib/fetchers/settings.fetchers'

export async function updateUserWebsiteSettings(
    input: WebsiteSettingsInput
): Promise<WebsiteSettingsDTO> {
    const session = await requireAuthzCapability('settings.manage.own')

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const userId = session.userId
    const parsed = websiteSettingsSchema.parse(input)
    const updated = await prisma.websiteSettings.upsert({
        where: { clerkUserId: userId },
        create: {
            clerkUserId: userId,
            preferredContact: parsed.preferredContact,
            appointmentReminders: parsed.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn,
            timezone: parsed.timezone,
        },
        update: {
            preferredContact: parsed.preferredContact,
            appointmentReminders: parsed.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn,
            timezone: parsed.timezone,
        },
        select: {
            preferredContact: true,
            appointmentReminders: true,
            marketingOptIn: true,
            timezone: true,
            updatedAt: true,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'WEBSITE_SETTINGS_UPDATED',
            resourceType: 'WebsiteSettings',
            resourceId: userId,
            details: JSON.stringify(parsed),
            timestamp: new Date(),
        },
    })

    revalidatePath('/settings')

    return createWebsiteSettingsDTO(
        {
            preferredContact: updated.preferredContact as 'email' | 'sms',
            appointmentReminders: updated.appointmentReminders,
            marketingOptIn: updated.marketingOptIn,
            timezone: updated.timezone,
        },
        updated.updatedAt
    )
}
