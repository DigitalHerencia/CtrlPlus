import { AdminActivityFeed } from '@/components/admin/admin-activity-feed'
import { getAdminRecentActivity } from '@/lib/fetchers/admin.fetchers'

interface AdminActivityPanelFeatureProps {
    tenantId: string
}

export async function AdminActivityPanelFeature({ tenantId }: AdminActivityPanelFeatureProps) {
    const events = await getAdminRecentActivity(tenantId)

    return <AdminActivityFeed events={events} />
}
