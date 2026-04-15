'use client'


import { Button } from '@/components/ui/button'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'

interface SettingsTabsNavProps {
    activeTab: 'profile' | 'account' | 'data' | 'docs'
    onTabChange: (tab: 'profile' | 'account' | 'data' | 'docs') => void
}


export function SettingsTabsNav({ activeTab, onTabChange }: SettingsTabsNavProps) {
    return (
        <WorkspacePageContextCard
            title="Documentation"
            description="Access product guides and reference docs while we temporarily hide additional settings tabs."
        >
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => onTabChange('docs')}
                    variant={activeTab === 'docs' ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs font-medium ${activeTab !== 'docs' ? 'bg-neutral-900' : ''}`}
                >
                    Documentation
                </Button>
            </div>
        </WorkspacePageContextCard>
    )
}
