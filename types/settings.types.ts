/**
 * @introduction Types — TODO: short one-line summary of settings.types.ts
 *
 * @description TODO: longer description for settings.types.ts. Keep it short — one or two sentences.
 * Domain: types
 * Public: TODO (yes/no)
 */
import type { Timestamp } from './common.types'

/**
 * NotificationPreferencesDTO — TODO: brief description of this type.
 */
/**
 * NotificationPreferencesDTO — TODO: brief description of this type.
 */
/**
 * NotificationPreferencesDTO — TODO: brief description of this type.
 */
export interface NotificationPreferencesDTO {
    email: boolean
    sms: boolean
    push: boolean
}

/**
 * UserSettingsViewDTO — TODO: brief description of this type.
 */
/**
 * UserSettingsViewDTO — TODO: brief description of this type.
 */
/**
 * UserSettingsViewDTO — TODO: brief description of this type.
 */
export interface UserSettingsViewDTO {
    userId: string
    theme: 'light' | 'dark' | 'system' | null
    language: string | null
    timezone: string | null
    notifications: NotificationPreferencesDTO
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    fullName: string | null
    email: string | null
    phone: string | null
    billingAddressLine1: string | null
    billingAddressLine2: string | null
    billingCity: string | null
    billingState: string | null
    billingPostalCode: string | null
    billingCountry: string | null
    vehicleMake: string | null
    vehicleModel: string | null
    vehicleYear: string | null
    vehicleTrim: string | null
    stripeCustomerId: string | null
    stripeDefaultPaymentMethodBrand: string | null
    stripeDefaultPaymentMethodLast4: string | null
    updatedAt: Timestamp | null
}

/**
 * TenantSettingsViewDTO — TODO: brief description of this type.
 */
/**
 * TenantSettingsViewDTO — TODO: brief description of this type.
 */
/**
 * TenantSettingsViewDTO — TODO: brief description of this type.
 */
export interface TenantSettingsViewDTO {
    tenantId: string
    businessName: string | null
    address: string | null
    taxId: string | null
    notificationEmail: string | null
    logoUrl: string | null
    updatedAt: Timestamp | null
}

/**
 * UpdateUserPreferencesInputDTO — TODO: brief description of this type.
 */
/**
 * UpdateUserPreferencesInputDTO — TODO: brief description of this type.
 */
/**
 * UpdateUserPreferencesInputDTO — TODO: brief description of this type.
 */
export interface UpdateUserPreferencesInputDTO {
    theme?: 'light' | 'dark' | 'system' | null
    language?: string | null
    timezone?: string | null
    fullName?: string | null
    email?: string | null
    phone?: string | null
    notifications?: {
        email?: boolean
        sms?: boolean
        push?: boolean
    }
    preferredContact?: 'email' | 'sms'
    appointmentReminders?: boolean
    marketingOptIn?: boolean
    billingAddressLine1?: string | null
    billingAddressLine2?: string | null
    billingCity?: string | null
    billingState?: string | null
    billingPostalCode?: string | null
    billingCountry?: string | null
    vehicleMake?: string | null
    vehicleModel?: string | null
    vehicleYear?: string | null
    vehicleTrim?: string | null
}

/**
 * UpdateTenantSettingsInputDTO — TODO: brief description of this type.
 */
/**
 * UpdateTenantSettingsInputDTO — TODO: brief description of this type.
 */
/**
 * UpdateTenantSettingsInputDTO — TODO: brief description of this type.
 */
export interface UpdateTenantSettingsInputDTO {
    businessName?: string | null
    address?: string | null
    taxId?: string | null
    notificationEmail?: string | null
    logoUrl?: string | null
}

/**
 * ExportDataRequestDTO — TODO: brief description of this type.
 */
/**
 * ExportDataRequestDTO — TODO: brief description of this type.
 */
/**
 * ExportDataRequestDTO — TODO: brief description of this type.
 */
export interface ExportDataRequestDTO {
    tenantId: string
    format: 'json' | 'csv'
}

/**
 * ExportHistoryRowDTO — TODO: brief description of this type.
 */
/**
 * ExportHistoryRowDTO — TODO: brief description of this type.
 */
/**
 * ExportHistoryRowDTO — TODO: brief description of this type.
 */
export interface ExportHistoryRowDTO {
    id: string
    format: 'json' | 'csv'
    requestedBy: string
    createdAt: Timestamp
}

/**
 * ExportDataResultDTO — TODO: brief description of this type.
 */
/**
 * ExportDataResultDTO — TODO: brief description of this type.
 */
/**
 * ExportDataResultDTO — TODO: brief description of this type.
 */
export interface ExportDataResultDTO {
    requestId: string
    tenantId: string
    format: 'json' | 'csv'
    createdAt: Timestamp
    status: 'queued' | 'completed'
}

/**
 * ExportOptionsViewDTO — TODO: brief description of this type.
 */
/**
 * ExportOptionsViewDTO — TODO: brief description of this type.
 */
/**
 * ExportOptionsViewDTO — TODO: brief description of this type.
 */
export interface ExportOptionsViewDTO {
    tenantId: string
    allowedFormats: Array<'json' | 'csv'>
    history: ExportHistoryRowDTO[]
}

// ---------------------------------------------------------------------------
// Backwards-compatible aliases for existing website settings surfaces
// ---------------------------------------------------------------------------
/**
 * WebsiteSettingsInput — TODO: brief description of this type.
 */
/**
 * WebsiteSettingsInput — TODO: brief description of this type.
 */
/**
 * WebsiteSettingsInput — TODO: brief description of this type.
 */
export interface WebsiteSettingsInput {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
}

/**
 * WebsiteSettingsDTO — TODO: brief description of this type.
 */
/**
 * WebsiteSettingsDTO — TODO: brief description of this type.
 */
/**
 * WebsiteSettingsDTO — TODO: brief description of this type.
 */
export interface WebsiteSettingsDTO {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
    updatedAt: Timestamp | null
}
