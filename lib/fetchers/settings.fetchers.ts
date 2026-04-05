import 'server-only'
import { requireAuthzCapability } from '@/lib/authz/guards'
import { requireOwnerOrAdmin } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import {
    type ExportHistoryRowDTO,
    type ExportOptionsViewDTO,
    type NotificationPreferencesDTO,
    type TenantSettingsViewDTO,
    type UserSettingsViewDTO,
    type WebsiteSettingsDTO,
    type WebsiteSettingsInput,
} from '@/types/settings.types'
import { DEFAULT_STORE_TIMEZONE } from '@/lib/constants/app'

const SETTINGS_TENANT_ID = 'default-tenant'

export function resolveSettingsTenantId(_tenantId?: string | null): string {
    void _tenantId
    return SETTINGS_TENANT_ID
}

function createDefaultWebsiteSettingsInput(): WebsiteSettingsInput {
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

function parseTenantSettingsPayload(
    payload: string | null
): Omit<TenantSettingsViewDTO, 'tenantId' | 'updatedAt'> {
    const fallback = {
        businessName: null,
        address: null,
        taxId: null,
        notificationEmail: null,
        logoUrl: null,
    }

    if (!payload) {
        return fallback
    }

    try {
        const parsed = JSON.parse(payload) as Record<string, unknown>
        return {
            businessName:
                typeof parsed.businessName === 'string'
                    ? parsed.businessName
                    : fallback.businessName,
            address: typeof parsed.address === 'string' ? parsed.address : fallback.address,
            taxId: typeof parsed.taxId === 'string' ? parsed.taxId : fallback.taxId,
            notificationEmail:
                typeof parsed.notificationEmail === 'string'
                    ? parsed.notificationEmail
                    : fallback.notificationEmail,
            logoUrl: typeof parsed.logoUrl === 'string' ? parsed.logoUrl : fallback.logoUrl,
        }
    } catch {
        return fallback
    }
}

function parseExportHistoryRow(row: {
    id: string
    userId: string
    details: string | null
    timestamp: Date
}): ExportHistoryRowDTO {
    let format: 'json' | 'csv' = 'json'

    if (row.details) {
        try {
            const parsed = JSON.parse(row.details) as Record<string, unknown>
            if (parsed.format === 'json' || parsed.format === 'csv') {
                format = parsed.format
            }
        } catch {
            // Ignore malformed payload and fallback to defaults.
        }
    }

    return {
        id: row.id,
        format,
        requestedBy: row.userId,
        createdAt: row.timestamp.toISOString(),
    }
}

export async function getUserSettingsView(): Promise<UserSettingsViewDTO> {
    const session = await requireAuthzCapability('settings.manage.own')

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const row = await prisma.websiteSettings.findFirst({
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

    const base = row
        ? {
              preferredContact: row.preferredContact as 'email' | 'sms',
              appointmentReminders: row.appointmentReminders,
              marketingOptIn: row.marketingOptIn,
              timezone: row.timezone,
              updatedAt: row.updatedAt.toISOString(),
          }
        : {
              preferredContact: 'email' as const,
              appointmentReminders: true,
              marketingOptIn: false,
              timezone: DEFAULT_STORE_TIMEZONE,
              updatedAt: null,
          }

    const notifications: NotificationPreferencesDTO = {
        email: base.preferredContact === 'email',
        sms: base.preferredContact === 'sms',
        push: base.marketingOptIn,
    }

    return {
        userId: session.userId,
        theme: 'system',
        language: 'en-US',
        timezone: base.timezone,
        notifications,
        preferredContact: base.preferredContact,
        appointmentReminders: base.appointmentReminders,
        marketingOptIn: base.marketingOptIn,
        updatedAt: base.updatedAt,
    }
}

export async function getTenantSettingsView(
    tenantId: string = 'default-tenant'
): Promise<TenantSettingsViewDTO> {
    const session = await requireAuthzCapability('settings.manage.own')
    requireOwnerOrAdmin(session.authz)
    const resolvedTenantId = resolveSettingsTenantId(tenantId)

    const latestSnapshot = await prisma.auditLog.findFirst({
        where: {
            action: 'TENANT_SETTINGS_UPDATED',
            resourceType: 'TenantSettings',
            resourceId: resolvedTenantId,
            deletedAt: null,
        },
        orderBy: { timestamp: 'desc' },
        select: {
            details: true,
            timestamp: true,
        },
    })

    const parsed = parseTenantSettingsPayload(latestSnapshot?.details ?? null)

    return {
        tenantId: resolvedTenantId,
        ...parsed,
        updatedAt: latestSnapshot?.timestamp.toISOString() ?? null,
    }
}

export async function getExportOptionsView(
    tenantId: string = 'default-tenant'
): Promise<ExportOptionsViewDTO> {
    const session = await requireAuthzCapability('settings.manage.own')
    requireOwnerOrAdmin(session.authz)
    const resolvedTenantId = resolveSettingsTenantId(tenantId)

    const rows = await prisma.auditLog.findMany({
        where: {
            action: 'SETTINGS_DATA_EXPORT_REQUESTED',
            resourceType: 'TenantSettings',
            resourceId: resolvedTenantId,
            deletedAt: null,
        },
        orderBy: { timestamp: 'desc' },
        take: 20,
        select: {
            id: true,
            userId: true,
            details: true,
            timestamp: true,
        },
    })

    return {
        tenantId: resolvedTenantId,
        allowedFormats: ['json', 'csv'],
        history: rows.map(parseExportHistoryRow),
    }
}

export async function getCurrentUserWebsiteSettings(): Promise<WebsiteSettingsDTO> {
    const settings = await getUserSettingsView()

    if (!settings.updatedAt) {
        return createWebsiteSettingsDTO(createDefaultWebsiteSettingsInput(), null)
    }

    return createWebsiteSettingsDTO(
        {
            preferredContact: settings.preferredContact,
            appointmentReminders: settings.appointmentReminders,
            marketingOptIn: settings.marketingOptIn,
            timezone: settings.timezone ?? DEFAULT_STORE_TIMEZONE,
        },
        settings.updatedAt
    )
}
