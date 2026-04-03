'use server'

import { requireAuthzCapability } from '@/lib/authz/guards'
import { requireOwnerOrAdmin } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import { revalidateSettingsPaths } from '@/lib/cache/revalidate-tags'
import {
    exportDataSchema,
    updateTenantSettingsSchema,
    updateUserPreferencesSchema,
    websiteSettingsSchema,
} from '@/schemas/settings.schemas'
import {
    type ExportDataRequestDTO,
    type ExportDataResultDTO,
    type TenantSettingsViewDTO,
    type UpdateTenantSettingsInputDTO,
    type UpdateUserPreferencesInputDTO,
    type UserSettingsViewDTO,
    type WebsiteSettingsDTO,
    type WebsiteSettingsInput,
} from '@/types/settings.types'
import {
    createWebsiteSettingsDTO,
    getTenantSettingsView,
    getUserSettingsView,
    resolveSettingsTenantId,
} from '@/lib/fetchers/settings.fetchers'

export async function updateUserPreferences(
    input: UpdateUserPreferencesInputDTO
): Promise<UserSettingsViewDTO> {
    const session = await requireAuthzCapability('settings.manage.own')

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = updateUserPreferencesSchema.parse(input)
    const current = await getUserSettingsView()

    const preferredContact =
        parsed.preferredContact ??
        (parsed.notifications?.sms
            ? 'sms'
            : parsed.notifications?.email
              ? 'email'
              : current.preferredContact)

    const updated = await prisma.websiteSettings.upsert({
        where: { clerkUserId: session.userId },
        create: {
            clerkUserId: session.userId,
            preferredContact,
            appointmentReminders: parsed.appointmentReminders ?? current.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn ?? current.marketingOptIn,
            timezone: parsed.timezone ?? current.timezone ?? 'America/Denver',
        },
        update: {
            preferredContact,
            appointmentReminders: parsed.appointmentReminders ?? current.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn ?? current.marketingOptIn,
            timezone: parsed.timezone ?? current.timezone ?? 'America/Denver',
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
            userId: session.userId,
            action: 'USER_PREFERENCES_UPDATED',
            resourceType: 'UserSettings',
            resourceId: session.userId,
            details: JSON.stringify(parsed),
            timestamp: new Date(),
        },
    })

    revalidateSettingsPaths()
    return {
        userId: session.userId,
        theme: parsed.theme ?? current.theme,
        language: parsed.language ?? current.language,
        timezone: updated.timezone,
        notifications: {
            email: updated.preferredContact === 'email',
            sms: updated.preferredContact === 'sms',
            push: updated.marketingOptIn,
        },
        preferredContact: updated.preferredContact as 'email' | 'sms',
        appointmentReminders: updated.appointmentReminders,
        marketingOptIn: updated.marketingOptIn,
        updatedAt: updated.updatedAt.toISOString(),
    }
}

export async function updateTenantSettings(
    tenantId: string,
    input: UpdateTenantSettingsInputDTO
): Promise<TenantSettingsViewDTO> {
    const session = await requireAuthzCapability('settings.manage.own')
    requireOwnerOrAdmin(session.authz)

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = updateTenantSettingsSchema.parse(input)
    const resolvedTenantId = resolveSettingsTenantId(tenantId)

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'TENANT_SETTINGS_UPDATED',
            resourceType: 'TenantSettings',
            resourceId: resolvedTenantId,
            details: JSON.stringify(parsed),
            timestamp: new Date(),
        },
    })

    revalidateSettingsPaths()
    return getTenantSettingsView(resolvedTenantId)
}

export async function exportData(input: ExportDataRequestDTO): Promise<ExportDataResultDTO> {
    const session = await requireAuthzCapability('settings.manage.own')
    requireOwnerOrAdmin(session.authz)

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = exportDataSchema.parse(input)
    const resolvedTenantId = resolveSettingsTenantId(parsed.tenantId)

    const row = await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'SETTINGS_DATA_EXPORT_REQUESTED',
            resourceType: 'TenantSettings',
            resourceId: resolvedTenantId,
            details: JSON.stringify({ format: parsed.format }),
            timestamp: new Date(),
        },
        select: {
            id: true,
            resourceId: true,
            timestamp: true,
        },
    })

    revalidateSettingsPaths()
    return {
        requestId: row.id,
        tenantId: resolvedTenantId,
        format: parsed.format,
        createdAt: row.timestamp.toISOString(),
        status: 'queued',
    }
}

export async function updateUserWebsiteSettings(
    input: WebsiteSettingsInput
): Promise<WebsiteSettingsDTO> {
    const parsed = websiteSettingsSchema.parse(input)
    const result = await updateUserPreferences(parsed)

    const session = await requireAuthzCapability('settings.manage.own')
    if (session.userId) {
        await prisma.auditLog.create({
            data: {
                userId: session.userId,
                action: 'WEBSITE_SETTINGS_UPDATED',
                resourceType: 'WebsiteSettings',
                resourceId: session.userId,
                details: JSON.stringify(parsed),
                timestamp: new Date(),
            },
        })
    }

    return createWebsiteSettingsDTO(
        {
            preferredContact: result.preferredContact,
            appointmentReminders: result.appointmentReminders,
            marketingOptIn: result.marketingOptIn,
            timezone: result.timezone ?? 'America/Denver',
        },
        result.updatedAt
    )
}
