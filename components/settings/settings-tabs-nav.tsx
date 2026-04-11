'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import { Button } from '@/components/ui/button'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'

interface SettingsTabsNavProps {
    activeTab: 'profile' | 'account' | 'data' | 'docs'
    onTabChange: (tab: 'profile' | 'account' | 'data' | 'docs') => void
}

const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'data', label: 'Data Export' },
    { id: 'docs', label: 'Documentation' },
] as const

/**
 * SettingsTabsNav — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SettingsTabsNav({ activeTab, onTabChange }: SettingsTabsNavProps) {
    return (
        <WorkspacePageContextCard>
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as typeof activeTab)}
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs font-medium"
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>
        </WorkspacePageContextCard>
    )
}
