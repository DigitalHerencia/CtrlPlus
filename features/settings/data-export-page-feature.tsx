import { SettingsEmptyState } from '@/components/settings/settings-empty-state'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
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
                <WorkspacePageIntro
                    label="Settings"
                    title="Data Export"
                    description="Access governed export controls to share operational data safely with customers, partners, or finance workflows."
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
            <WorkspacePageIntro
                label="Settings"
                title="Data Export"
                description="Access governed export controls to share operational data safely with customers, partners, or finance workflows."
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
