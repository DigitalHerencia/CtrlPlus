'use client'


import { SettingsSectionNav } from '@/components/settings/settings-section-nav'

interface SettingsTabsClientProps {
    active: 'profile' | 'account' | 'data'
}


export function SettingsTabsClient({ active }: SettingsTabsClientProps) {
    return <SettingsSectionNav active={active} />
}
