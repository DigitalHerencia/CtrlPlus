import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminQuickLinks } from '@/components/admin/admin-quick-links'
import { getAdminQuickLinks } from '@/lib/fetchers/admin.fetchers'

import { AdminActivityPanelFeature } from './admin-activity-panel-feature'
import { AdminKpiGridFeature } from './admin-kpi-grid-feature'
import { AdminQuickActionsClient } from './admin-quick-actions.client'

const TENANT_ID = 'single-store'

export async function AdminDashboardPageFeature() {
    const quickLinks = await getAdminQuickLinks()

    return (
        <div className="space-y-6">
            <AdminPageHeader
                label="Admin"
                title="Command and control"
                description="Monitor bookings, revenue, previews, moderation, and operational activity from one dashboard."
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
