export interface WebsiteSettingsInput {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
}

import type { Timestamp } from './common.types'

export interface WebsiteSettingsDTO {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
    updatedAt: Timestamp | null
}
