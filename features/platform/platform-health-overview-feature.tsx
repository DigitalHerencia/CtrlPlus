import { PlatformHealthOverview } from '@/components/platform/platform-health-overview'
import { PlatformHealthPanel } from '@/components/platform/platform-health-panel'
import { PlatformKpiGrid } from '@/components/platform/platform-kpi-grid'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Badge } from '@/components/ui/badge'
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
            <WorkspacePageIntro
                label="Platform"
                title="Platform health"
                description="Monitor real-time service readiness to keep customer experiences fast, reliable, and interruption-free."
            />
            <WorkspacePageContextCard
                title="Current Health"
                description="Server-derived platform status"
            >
                <Badge
                    variant={
                        health.status === 'healthy'
                            ? 'secondary'
                            : health.status === 'degraded'
                              ? 'outline'
                              : 'destructive'
                    }
                    className="uppercase"
                >
                    {health.status}
                </Badge>
            </WorkspacePageContextCard>

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
