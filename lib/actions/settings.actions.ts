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
import { DEFAULT_STORE_TIMEZONE } from '@/lib/constants/app'

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
            timezone: parsed.timezone ?? current.timezone ?? DEFAULT_STORE_TIMEZONE,
            fullName: parsed.fullName ?? current.fullName,
            email: parsed.email ?? current.email,
            phone: parsed.phone ?? current.phone,
            billingAddressLine1: parsed.billingAddressLine1 ?? current.billingAddressLine1,
            billingAddressLine2: parsed.billingAddressLine2 ?? current.billingAddressLine2,
            billingCity: parsed.billingCity ?? current.billingCity,
            billingState: parsed.billingState ?? current.billingState,
            billingPostalCode: parsed.billingPostalCode ?? current.billingPostalCode,
            billingCountry: parsed.billingCountry ?? current.billingCountry,
            vehicleMake: parsed.vehicleMake ?? current.vehicleMake,
            vehicleModel: parsed.vehicleModel ?? current.vehicleModel,
            vehicleYear: parsed.vehicleYear ?? current.vehicleYear,
            vehicleTrim: parsed.vehicleTrim ?? current.vehicleTrim,
        },
        update: {
            preferredContact,
            appointmentReminders: parsed.appointmentReminders ?? current.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn ?? current.marketingOptIn,
            timezone: parsed.timezone ?? current.timezone ?? DEFAULT_STORE_TIMEZONE,
            fullName: parsed.fullName ?? current.fullName,
            email: parsed.email ?? current.email,
            phone: parsed.phone ?? current.phone,
            billingAddressLine1: parsed.billingAddressLine1 ?? current.billingAddressLine1,
            billingAddressLine2: parsed.billingAddressLine2 ?? current.billingAddressLine2,
            billingCity: parsed.billingCity ?? current.billingCity,
            billingState: parsed.billingState ?? current.billingState,
            billingPostalCode: parsed.billingPostalCode ?? current.billingPostalCode,
            billingCountry: parsed.billingCountry ?? current.billingCountry,
            vehicleMake: parsed.vehicleMake ?? current.vehicleMake,
            vehicleModel: parsed.vehicleModel ?? current.vehicleModel,
            vehicleYear: parsed.vehicleYear ?? current.vehicleYear,
            vehicleTrim: parsed.vehicleTrim ?? current.vehicleTrim,
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
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        billingAddressLine1: updated.billingAddressLine1,
        billingAddressLine2: updated.billingAddressLine2,
        billingCity: updated.billingCity,
        billingState: updated.billingState,
        billingPostalCode: updated.billingPostalCode,
        billingCountry: updated.billingCountry,
        vehicleMake: updated.vehicleMake,
        vehicleModel: updated.vehicleModel,
        vehicleYear: updated.vehicleYear,
        vehicleTrim: updated.vehicleTrim,
        stripeCustomerId: updated.stripeCustomerId,
        stripeDefaultPaymentMethodBrand: updated.stripeDefaultPaymentMethodBrand,
        stripeDefaultPaymentMethodLast4: updated.stripeDefaultPaymentMethodLast4,
        updatedAt: updated.updatedAt.toISOString(),
    }
}

export async function syncStripePaymentSettingsSummary(input: {
    clerkUserId: string
    stripeCustomerId: string
    stripeDefaultPaymentMethodId: string | null
    stripeDefaultPaymentMethodBrand: string | null
    stripeDefaultPaymentMethodLast4: string | null
}): Promise<void> {
    await prisma.websiteSettings.upsert({
        where: { clerkUserId: input.clerkUserId },
        create: {
            clerkUserId: input.clerkUserId,
            stripeCustomerId: input.stripeCustomerId,
            stripeDefaultPaymentMethodId: input.stripeDefaultPaymentMethodId,
            stripeDefaultPaymentMethodBrand: input.stripeDefaultPaymentMethodBrand,
            stripeDefaultPaymentMethodLast4: input.stripeDefaultPaymentMethodLast4,
            preferredContact: 'email',
            appointmentReminders: true,
            marketingOptIn: false,
            timezone: DEFAULT_STORE_TIMEZONE,
        },
        update: {
            stripeCustomerId: input.stripeCustomerId,
            stripeDefaultPaymentMethodId: input.stripeDefaultPaymentMethodId,
            stripeDefaultPaymentMethodBrand: input.stripeDefaultPaymentMethodBrand,
            stripeDefaultPaymentMethodLast4: input.stripeDefaultPaymentMethodLast4,
        },
    })
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
