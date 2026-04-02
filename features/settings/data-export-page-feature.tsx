import { SettingsPageHeader } from '@/components/settings/settings-page-header'
import { SettingsEmptyState } from '@/components/settings/settings-empty-state'
import { getExportOptionsView } from '@/lib/fetchers/settings.fetchers'
import { exportData } from '@/lib/actions/settings.actions'

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
                onExport={exportData}
            />
        </div>
    )
}
