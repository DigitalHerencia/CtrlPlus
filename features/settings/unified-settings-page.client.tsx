'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { usePathname, useRouter } from 'next/navigation'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { SettingsTabsNav } from '@/components/settings/settings-tabs-nav'
import { ProfileTabContentClient } from './profile-tab-content.client'
import { AccountTabContent } from './account-tab-content'
import { DataExportTabContent } from './data-export-tab-content'
import { DocsTabContent } from './docs-tab-content'
import { useEffect, useState } from 'react'
import { type UserSettingsViewDTO } from '@/types/settings.types'

interface UnifiedSettingsPageClientProps {
    userSettings: UserSettingsViewDTO
    onSaveProfile: (input: {
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
    }) => Promise<unknown>
}

type TabType = 'profile' | 'account' | 'data' | 'docs'

function getTabFromPathname(pathname: string): TabType {
    if (pathname.includes('/account')) return 'account'
    if (pathname.includes('/data')) return 'data'
    if (pathname.includes('/docs')) return 'docs'
    return 'profile'
}

/**
 * UnifiedSettingsPageClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function UnifiedSettingsPageClient({
    userSettings,
    onSaveProfile,
}: UnifiedSettingsPageClientProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabType>('profile')

    // Detect active tab from pathname on mount
    useEffect(() => {
        setActiveTab(getTabFromPathname(pathname))
    }, [pathname])

    const handleTabChange = (tab: TabType) => {
        const routes: Record<TabType, string> = {
            profile: '/settings/profile',
            account: '/settings/account',
            data: '/settings/data',
            docs: '/docs',
        }
        router.push(routes[tab])
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <WorkspacePageIntro
                label="Settings"
                title="Profile Settings"
                description="Personalize how you run customer conversations, notifications, and day-to-day wrap operations."
            />

            {/* Tabs Navigation */}
            <SettingsTabsNav activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Tab Content */}
            <div>
                {activeTab === 'profile' && (
                    <ProfileTabContentClient
                        initialSettings={userSettings}
                        onSave={onSaveProfile}
                    />
                )}

                {activeTab === 'account' && <AccountTabContent />}

                {activeTab === 'data' && <DataExportTabContent />}

                {activeTab === 'docs' && <DocsTabContent />}
            </div>
        </div>
    )
}
