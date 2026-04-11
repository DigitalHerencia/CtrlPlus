'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { SettingsSectionNav } from '@/components/settings/settings-section-nav'

interface SettingsTabsClientProps {
    active: 'profile' | 'account' | 'data'
}

/**
 * SettingsTabsClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SettingsTabsClient({ active }: SettingsTabsClientProps) {
    return <SettingsSectionNav active={active} />
}
