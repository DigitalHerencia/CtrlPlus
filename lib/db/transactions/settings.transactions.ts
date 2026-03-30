import type { Prisma } from '@prisma/client'
import type { WebsiteSettingsInput } from '@/types/settings.types'

/**
 * Upsert website settings for a Clerk user inside a transaction.
 * This keeps settings write logic centralized in the DB transactions layer.
 */
export async function upsertWebsiteSettingsTx(
    tx: Prisma.TransactionClient,
    clerkUserId: string,
    data: WebsiteSettingsInput
) {
    return tx.websiteSettings.upsert({
        where: { clerkUserId },
        create: {
            clerkUserId,
            preferredContact: data.preferredContact,
            appointmentReminders: data.appointmentReminders,
            marketingOptIn: data.marketingOptIn,
            timezone: data.timezone,
        },
        update: {
            preferredContact: data.preferredContact,
            appointmentReminders: data.appointmentReminders,
            marketingOptIn: data.marketingOptIn,
            timezone: data.timezone,
            updatedAt: new Date(),
        },
    })
}
