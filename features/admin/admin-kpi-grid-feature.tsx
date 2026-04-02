import { AdminKpiGrid } from '@/components/admin/admin-kpi-grid'
import { getTenantMetrics } from '@/lib/fetchers/admin.fetchers'

interface AdminKpiGridFeatureProps {
    tenantId: string
    startDate?: string | null
    endDate?: string | null
}

export async function AdminKpiGridFeature({
    tenantId,
    startDate,
    endDate,
}: AdminKpiGridFeatureProps) {
    const metrics = await getTenantMetrics({ tenantId, startDate, endDate })

    return (
        <AdminKpiGrid
            cards={[
                {
                    id: 'bookings',
                    label: 'Bookings',
                    value: metrics.bookingsCount,
                    description: 'Tenant-scoped booking activity',
                },
                {
                    id: 'revenue',
                    label: 'Revenue',
                    value: new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(metrics.revenueTotal / 100),
                    description: 'Paid invoice total',
                },
                {
                    id: 'previews',
                    label: 'Preview generation',
                    value: metrics.previewGenerationCount,
                    description: 'Generated visualizer previews',
                },
                {
                    id: 'range',
                    label: 'Date range',
                    value:
                        metrics.dateRangeStart && metrics.dateRangeEnd
                            ? `${metrics.dateRangeStart.toISOString().slice(0, 10)} → ${metrics.dateRangeEnd.toISOString().slice(0, 10)}`
                            : 'Last 7 days',
                    description: 'Scope used for this summary',
                },
            ]}
        />
    )
}
