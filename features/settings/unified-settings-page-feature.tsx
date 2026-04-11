import { getUserSettingsView } from '@/lib/fetchers/settings.fetchers'
import { updateUserPreferences } from '@/lib/actions/settings.actions'
import { UnifiedSettingsPageClient } from './unified-settings-page.client'

export async function UnifiedSettingsPageFeature() {
    const userSettings = await getUserSettingsView()

    async function onSaveProfile(input: {
        theme: 'light' | 'dark' | 'system'
        language: string | null
        timezone: string | null
        notifications: { email: boolean; sms: boolean; push: boolean }
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
    }) {
        'use server'
        return updateUserPreferences(input)
    }

    return <UnifiedSettingsPageClient userSettings={userSettings} onSaveProfile={onSaveProfile} />
}
