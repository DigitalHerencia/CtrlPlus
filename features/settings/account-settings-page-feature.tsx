import { SettingsPageHeader } from '@/components/settings/settings-page-header'
import { SettingsEmptyState } from '@/components/settings/settings-empty-state'
import { getTenantSettingsView } from '@/lib/fetchers/settings.fetchers'

import { SettingsTabsClient } from './settings-tabs.client'
import { TenantSettingsFormClient } from './tenant-settings-form.client'

interface AccountSettingsPageFeatureProps {
    tenantId?: string
}

export async function AccountSettingsPageFeature({
    tenantId = 'default-tenant',
}: AccountSettingsPageFeatureProps) {
    let tenantSettings = null

    try {
        tenantSettings = await getTenantSettingsView(tenantId)
    } catch {
        return (
            <div className="space-y-6">
                <SettingsPageHeader
                    title="Account Settings"
                    description="Owner-managed business configuration and branding settings."
                />
                <SettingsTabsClient active="account" />
                <SettingsEmptyState
                    title="Account settings unavailable"
                    description="Owner-level access is required to view tenant settings."
                />
            </div>
        )
    }

    async function onSave(input: {
        businessName?: string | null
        address?: string | null
        taxId?: string | null
        notificationEmail?: string | null
        logoUrl?: string | null
    }) {
        'use server'
        const { updateTenantSettings } = await import('@/lib/actions/settings.actions')
        return updateTenantSettings(tenantId, input)
    }

    return (
        <div className="space-y-6">
            <SettingsPageHeader
                title="Account Settings"
                description="Owner-managed business configuration and branding settings."
            />
            <SettingsTabsClient active="account" />
            <TenantSettingsFormClient initialSettings={tenantSettings} onSave={onSave} />
        </div>
    )
}
