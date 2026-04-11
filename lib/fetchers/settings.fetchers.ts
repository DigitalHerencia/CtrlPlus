/**
 * @introduction Fetchers — TODO: short one-line summary of settings.fetchers.ts
 *
 * @description TODO: longer description for settings.fetchers.ts. Keep it short — one or two sentences.
 * Domain: fetchers
 * Public: TODO (yes/no)
 */
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

/**
 * resolveSettingsTenantId — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * resolveSettingsTenantId — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * resolveSettingsTenantId — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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

/**
 * createWebsiteSettingsDTO — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * createWebsiteSettingsDTO — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * createWebsiteSettingsDTO — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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

    const [row, user] = await Promise.all([
        prisma.websiteSettings.findFirst({
            where: {
                clerkUserId: session.userId,
                deletedAt: null,
            },
            select: {
                preferredContact: true,
                appointmentReminders: true,
                marketingOptIn: true,
                timezone: true,
                fullName: true,
                email: true,
                phone: true,
                billingAddressLine1: true,
                billingAddressLine2: true,
                billingCity: true,
                billingState: true,
                billingPostalCode: true,
                billingCountry: true,
                vehicleMake: true,
                vehicleModel: true,
                vehicleYear: true,
                vehicleTrim: true,
                stripeCustomerId: true,
                stripeDefaultPaymentMethodBrand: true,
                stripeDefaultPaymentMethodLast4: true,
                updatedAt: true,
            },
        }),
        prisma.user.findFirst({
            where: {
                clerkUserId: session.userId,
                deletedAt: null,
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
            },
        }),
    ])

    const fallbackFullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()

    const base = row
        ? {
              preferredContact: row.preferredContact as 'email' | 'sms',
              appointmentReminders: row.appointmentReminders,
              marketingOptIn: row.marketingOptIn,
              timezone: row.timezone,
              fullName: row.fullName ?? (fallbackFullName || null),
              email: row.email ?? user?.email ?? null,
              phone: row.phone ?? null,
              billingAddressLine1: row.billingAddressLine1 ?? null,
              billingAddressLine2: row.billingAddressLine2 ?? null,
              billingCity: row.billingCity ?? null,
              billingState: row.billingState ?? null,
              billingPostalCode: row.billingPostalCode ?? null,
              billingCountry: row.billingCountry ?? null,
              vehicleMake: row.vehicleMake ?? null,
              vehicleModel: row.vehicleModel ?? null,
              vehicleYear: row.vehicleYear ?? null,
              vehicleTrim: row.vehicleTrim ?? null,
              stripeCustomerId: row.stripeCustomerId ?? null,
              stripeDefaultPaymentMethodBrand: row.stripeDefaultPaymentMethodBrand ?? null,
              stripeDefaultPaymentMethodLast4: row.stripeDefaultPaymentMethodLast4 ?? null,
              updatedAt: row.updatedAt.toISOString(),
          }
        : {
              preferredContact: 'email' as const,
              appointmentReminders: true,
              marketingOptIn: false,
              timezone: DEFAULT_STORE_TIMEZONE,
              fullName: fallbackFullName || null,
              email: user?.email ?? null,
              phone: null,
              billingAddressLine1: null,
              billingAddressLine2: null,
              billingCity: null,
              billingState: null,
              billingPostalCode: null,
              billingCountry: null,
              vehicleMake: null,
              vehicleModel: null,
              vehicleYear: null,
              vehicleTrim: null,
              stripeCustomerId: null,
              stripeDefaultPaymentMethodBrand: null,
              stripeDefaultPaymentMethodLast4: null,
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
        fullName: base.fullName,
        email: base.email,
        phone: base.phone,
        billingAddressLine1: base.billingAddressLine1,
        billingAddressLine2: base.billingAddressLine2,
        billingCity: base.billingCity,
        billingState: base.billingState,
        billingPostalCode: base.billingPostalCode,
        billingCountry: base.billingCountry,
        vehicleMake: base.vehicleMake,
        vehicleModel: base.vehicleModel,
        vehicleYear: base.vehicleYear,
        vehicleTrim: base.vehicleTrim,
        stripeCustomerId: base.stripeCustomerId,
        stripeDefaultPaymentMethodBrand: base.stripeDefaultPaymentMethodBrand,
        stripeDefaultPaymentMethodLast4: base.stripeDefaultPaymentMethodLast4,
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
