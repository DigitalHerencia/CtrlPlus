import type { Timestamp } from './common.types'

export interface NotificationPreferencesDTO {
    email: boolean
    sms: boolean
    push: boolean
}

export interface UserSettingsViewDTO {
    userId: string
    theme: 'light' | 'dark' | 'system' | null
    language: string | null
    timezone: string | null
    notifications: NotificationPreferencesDTO
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    updatedAt: Timestamp | null
}

export interface TenantSettingsViewDTO {
    tenantId: string
    businessName: string | null
    address: string | null
    taxId: string | null
    notificationEmail: string | null
    logoUrl: string | null
    updatedAt: Timestamp | null
}

export interface UpdateUserPreferencesInputDTO {
    theme?: 'light' | 'dark' | 'system' | null
    language?: string | null
    timezone?: string | null
    notifications?: {
        email?: boolean
        sms?: boolean
        push?: boolean
    }
    preferredContact?: 'email' | 'sms'
    appointmentReminders?: boolean
    marketingOptIn?: boolean
}

export interface UpdateTenantSettingsInputDTO {
    businessName?: string | null
    address?: string | null
    taxId?: string | null
    notificationEmail?: string | null
    logoUrl?: string | null
}

export interface ExportDataRequestDTO {
    tenantId: string
    format: 'json' | 'csv'
}

export interface ExportHistoryRowDTO {
    id: string
    format: 'json' | 'csv'
    requestedBy: string
    createdAt: Timestamp
}

export interface ExportDataResultDTO {
    requestId: string
    tenantId: string
    format: 'json' | 'csv'
    createdAt: Timestamp
    status: 'queued' | 'completed'
}

export interface ExportOptionsViewDTO {
    tenantId: string
    allowedFormats: Array<'json' | 'csv'>
    history: ExportHistoryRowDTO[]
}

// ---------------------------------------------------------------------------
// Backwards-compatible aliases for existing website settings surfaces
// ---------------------------------------------------------------------------
export interface WebsiteSettingsInput {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
}

export interface WebsiteSettingsDTO {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
    updatedAt: Timestamp | null
}
