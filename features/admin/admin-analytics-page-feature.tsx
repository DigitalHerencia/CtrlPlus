import { AdminChartPanel } from '@/components/admin/admin-chart-panel'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { getAnalyticsSeries } from '@/lib/fetchers/admin.fetchers'

import { AdminKpiGridFeature } from './admin-kpi-grid-feature'
import { AdminAnalyticsFiltersClient } from './admin-analytics-filters.client'

const TENANT_ID = 'single-store'

interface AdminAnalyticsPageFeatureProps {
    startDate?: string | null
    endDate?: string | null
}

export async function AdminAnalyticsPageFeature({
    startDate,
    endDate,
}: AdminAnalyticsPageFeatureProps) {
    const series = await getAnalyticsSeries({ tenantId: TENANT_ID, startDate, endDate })

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Admin"
                title="Analytics"
                description="Track booking and preview momentum to identify what is driving customer confidence and conversion."
            />

            <AdminAnalyticsFiltersClient />
            <AdminKpiGridFeature tenantId={TENANT_ID} startDate={startDate} endDate={endDate} />
            <AdminChartPanel title="Daily activity" series={series} />
        </div>
    )
}
