import { AdminQuickLinks } from '@/components/admin/admin-quick-links'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { getAdminQuickLinks } from '@/lib/fetchers/admin.fetchers'

import { AdminActivityPanelFeature } from './admin-activity-panel-feature'
import { AdminKpiGridFeature } from './admin-kpi-grid-feature'
import { AdminQuickActionsClient } from './admin-quick-actions.client'

const TENANT_ID = 'single-store'

export async function AdminDashboardPageFeature() {
    const quickLinks = await getAdminQuickLinks()

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="WrapOps™"
                title="Wrap Operations Command Center"
                description="Monitor the pulse of your wrap business. Track installations, revenue, customer satisfaction, and keep every project on schedule."
            />

            <AdminKpiGridFeature tenantId={TENANT_ID} />

            <div className="grid gap-4 xl:grid-cols-2">
                <AdminActivityPanelFeature tenantId={TENANT_ID} />
                <AdminQuickLinks links={quickLinks} />
            </div>

            <AdminQuickActionsClient />
        </div>
    )
}
