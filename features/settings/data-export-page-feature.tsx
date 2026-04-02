import { SettingsPageHeader } from '@/components/settings/settings-page-header'
import { SettingsEmptyState } from '@/components/settings/settings-empty-state'
import { getExportOptionsView } from '@/lib/fetchers/settings.fetchers'

import { ExportDataActionsClient } from './export-data-actions.client'
import { SettingsTabsClient } from './settings-tabs.client'

interface DataExportPageFeatureProps {
    tenantId?: string
}

export async function DataExportPageFeature({
    tenantId = 'default-tenant',
}: DataExportPageFeatureProps) {
    let exportOptions = null

    try {
        exportOptions = await getExportOptionsView(tenantId)
    } catch {
        return (
            <div className="space-y-6">
                <SettingsPageHeader
                    title="Data Export"
                    description="Owner-only export controls for operational data portability."
                />
                <SettingsTabsClient active="data" />
                <SettingsEmptyState
                    title="Data export unavailable"
                    description="Owner-level access is required to request exports."
                />
            </div>
        )
    }

    async function onExport(input: { tenantId: string; format: 'json' | 'csv' }) {
        'use server'
        const { exportData } = await import('@/lib/actions/settings.actions')
        return exportData(input)
    }

    return (
        <div className="space-y-6">
            <SettingsPageHeader
                title="Data Export"
                description="Owner-only export controls for operational data portability."
            />
            <SettingsTabsClient active="data" />
            <ExportDataActionsClient
                tenantId={tenantId}
                history={exportOptions.history}
                onExport={onExport}
            />
        </div>
    )
}
