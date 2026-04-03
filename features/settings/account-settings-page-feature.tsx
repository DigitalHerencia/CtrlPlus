import { SettingsPageHeader } from '@/components/settings/settings-page-header'
import { SettingsEmptyState } from '@/components/settings/settings-empty-state'
import { getTenantSettingsView } from '@/lib/fetchers/settings.fetchers'
import { updateTenantSettings } from '@/lib/actions/settings.actions'

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
                    description="Shape your brand presence and business defaults so every wrap customer touchpoint feels premium and consistent."
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
        return updateTenantSettings(tenantId, input)
    }

    return (
        <div className="space-y-6">
            <SettingsPageHeader
                title="Account Settings"
                description="Shape your brand presence and business defaults so every wrap customer touchpoint feels premium and consistent."
            />
            <SettingsTabsClient active="account" />
            <TenantSettingsFormClient initialSettings={tenantSettings} onSave={onSave} />
        </div>
    )
}
