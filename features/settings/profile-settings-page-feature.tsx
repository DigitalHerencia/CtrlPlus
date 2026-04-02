import { SettingsPageHeader } from '@/components/settings/settings-page-header'
import { CredentialManagementPanel } from '@/components/settings/security/credential-management-panel'
import { SecuritySettingsPanel } from '@/components/settings/security/security-settings-panel'
import { SecurityStatusCard } from '@/components/settings/security/security-status-card'
import { getUserSettingsView } from '@/lib/fetchers/settings.fetchers'
import { updateUserPreferences } from '@/lib/actions/settings.actions'

import { SettingsTabsClient } from './settings-tabs.client'
import { UserSettingsFormClient } from './user-settings-form.client'

export async function ProfileSettingsPageFeature() {
    const userSettings = await getUserSettingsView()

    return (
        <div className="space-y-6">
            <SettingsPageHeader
                title="Profile Settings"
                description="Manage personal preferences, notifications, and account-level defaults."
            />
            <SettingsTabsClient active="profile" />
            <UserSettingsFormClient initialSettings={userSettings} onSave={updateUserPreferences} />

            <SecuritySettingsPanel>
                <div className="grid gap-3 sm:grid-cols-2">
                    <SecurityStatusCard title="MFA" value="Managed by Clerk" />
                    <SecurityStatusCard title="Session security" value="Server-authoritative" />
                </div>
                <div className="mt-4">
                    <CredentialManagementPanel>
                        <p className="text-sm text-neutral-400">
                            Credential and identity operations remain managed by the auth provider.
                        </p>
                    </CredentialManagementPanel>
                </div>
            </SecuritySettingsPanel>
        </div>
    )
}
