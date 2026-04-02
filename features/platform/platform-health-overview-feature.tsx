import { PlatformHealthOverview } from '@/components/platform/platform-health-overview'
import { PlatformHealthPanel } from '@/components/platform/platform-health-panel'
import { PlatformKpiGrid } from '@/components/platform/platform-kpi-grid'
import { PlatformPageHeader } from '@/components/platform/platform-page-header'
import {
    getDependencyHealth,
    getPlatformHealthOverview,
    getPlatformStatusOverview,
} from '@/lib/fetchers/platform.fetchers'

export async function PlatformHealthOverviewFeature() {
    const [health, dependencies, statusOverview] = await Promise.all([
        getPlatformHealthOverview(),
        getDependencyHealth(),
        getPlatformStatusOverview(),
    ])

    return (
        <div className="space-y-6">
            <PlatformPageHeader
                title="Platform health"
                description="Server-derived health and dependency status with explicit degraded/down visibility."
                status={health.status}
            />

            <PlatformKpiGrid
                items={[
                    { label: 'Active users', value: statusOverview.activeUsers },
                    { label: 'Active bookings', value: statusOverview.activeBookings },
                    { label: 'Active invoices', value: statusOverview.activeInvoices },
                    { label: 'Active wraps', value: statusOverview.activeWraps },
                ]}
            />

            <PlatformHealthPanel dependencies={dependencies} />
            <PlatformHealthOverview status={statusOverview} />
        </div>
    )
}
