import { AdminAuditLogTable } from '@/components/admin/admin-audit-log-table'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { getAuditLog } from '@/lib/fetchers/admin.fetchers'

import { AdminAuditFiltersClient } from './admin-audit-filters.client'

const TENANT_ID = 'single-store'

interface AdminAuditPageFeatureProps {
    eventType?: string | null
    resourceType?: string | null
}

export async function AdminAuditPageFeature({
    eventType,
    resourceType,
}: AdminAuditPageFeatureProps) {
    const rows = await getAuditLog({
        tenantId: TENANT_ID,
        eventType,
        resourceType,
        limit: 100,
    })

    return (
        <div className="space-y-6">
            <AdminPageHeader
                label="Admin"
                title="Audit history"
                description="Append-only action history for administrative and operational events."
            />

            <AdminAuditFiltersClient />
            <AdminAuditLogTable rows={rows} />
        </div>
    )
}
