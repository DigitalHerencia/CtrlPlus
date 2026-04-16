'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { SettingsTabsNav } from '@/components/settings/settings-tabs-nav'
import { ProfileTabContentClient } from './profile-tab-content.client'
import { AccountTabContent } from './account-tab-content'
import { DataExportTabContent } from './data-export-tab-content'
import { DocsTabContent } from './docs-tab-content'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
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

export function UnifiedSettingsPageClient({
    userSettings,
    onSaveProfile,
}: UnifiedSettingsPageClientProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabType>('profile')
    const [showReminder, setShowReminder] = useState(!Boolean(userSettings.updatedAt))
    const [optOutChecked, setOptOutChecked] = useState(false)
    const [optOutMessage, setOptOutMessage] = useState<string | null>(null)
    const [optOutError, setOptOutError] = useState<string | null>(null)
    const [isPendingGenericSave, setIsPendingGenericSave] = useState(false)

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

    async function handleSaveGenericSettings() {
        if (!optOutChecked) {
            setOptOutError('Please confirm that you want to save generic defaults.')
            return
        }

        setOptOutError(null)
        setOptOutMessage(null)
        setIsPendingGenericSave(true)

        try {
            await onSaveProfile({
                theme: 'system',
                language: 'en-US',
                timezone: userSettings.timezone ?? 'America/Denver',
                notifications: { email: true, sms: false, push: false },
                preferredContact: 'email',
                appointmentReminders: true,
                marketingOptIn: false,
                fullName: null,
                email: null,
                phone: null,
                billingAddressLine1: null,
                billingAddressLine2: null,
                billingCity: null,
                billingState: null,
                billingPostalCode: null,
                billingCountry: 'US',
                vehicleMake: null,
                vehicleModel: null,
                vehicleYear: null,
                vehicleTrim: null,
            })
            setOptOutMessage('Generic settings have been saved. You can always update them later.')
            setShowReminder(false)
        } catch (error) {
            setOptOutError(
                error instanceof Error
                    ? error.message
                    : 'Saving generic settings failed. Please try again.'
            )
        } finally {
            setIsPendingGenericSave(false)
        }
    }

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Settings"
                title="Profile Settings"
                description="Personalize how you run customer conversations, notifications, and day-to-day wrap operations."
            />

            <SettingsTabsNav activeTab={activeTab} onTabChange={handleTabChange} />

            <Sheet open={showReminder} onOpenChange={setShowReminder}>
                <SheetContent side="bottom" className="max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>Save your settings before you continue</SheetTitle>
                        <SheetDescription>
                            Saving your profile today means the visualizer can auto-fill your
                            contact, appointment, and billing details so previews, bookings, and
                            reminders work without extra typing.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 rounded-xl border border-blue-700/50 bg-blue-950/60 p-4 text-sm text-neutral-200">
                        <p className="font-semibold text-neutral-100">Why this matters</p>
                        <ul className="list-disc space-y-2 pl-5 text-neutral-300">
                            <li>
                                Auto-populate your profile for visualizer previews and wrap
                                previews.
                            </li>
                            <li>Make appointments faster with saved contact and schedule data.</li>
                            <li>Keep notifications and reminders aligned with your preferences.</li>
                        </ul>
                    </div>

                    <label className="flex items-start gap-3 rounded-lg border border-neutral-700/60 bg-neutral-950/80 p-4 text-sm text-neutral-200">
                        <input
                            type="checkbox"
                            checked={optOutChecked}
                            onChange={(event) => setOptOutChecked(event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-blue-600"
                        />
                        <span>
                            I want to save generic, non-identifiable defaults instead of my full
                            personal profile.
                        </span>
                    </label>

                    {optOutError ? (
                        <div className="rounded-md border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                            {optOutError}
                        </div>
                    ) : null}

                    {optOutMessage ? (
                        <div className="rounded-md border border-emerald-900/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
                            {optOutMessage}
                        </div>
                    ) : null}

                    <SheetFooter className="justify-between gap-3">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button variant="outline" onClick={() => setShowReminder(false)}>
                                Continue to settings
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSaveGenericSettings}
                                disabled={isPendingGenericSave}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {isPendingGenericSave ? 'Saving…' : 'Save generic defaults'}
                            </Button>
                        </div>
                        <SheetClose asChild>
                            <Button variant="ghost" type="button">
                                Dismiss for now
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <div>
                {activeTab === 'profile' && (
                    <ProfileTabContentClient
                        initialSettings={userSettings}
                        onSave={onSaveProfile}
                        onSettingsSaved={() => setShowReminder(false)}
                    />
                )}

                {activeTab === 'account' && <AccountTabContent />}

                {activeTab === 'data' && <DataExportTabContent />}

                {activeTab === 'docs' && <DocsTabContent />}
            </div>
        </div>
    )
}
