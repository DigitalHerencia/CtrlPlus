import { Suspense } from 'react'

import { SchedulingDashboardHeader } from '@/components/scheduling/scheduling-dashboard-header'
import {
    SchedulingBookingTableSkeleton,
    SchedulingDashboardStatsSkeleton,
} from '@/components/scheduling/scheduling-skeletons'
import { SchedulingDashboardToolbar } from '@/components/scheduling/scheduling-dashboard-toolbar'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { parseSchedulingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { SchedulingDashboardFiltersClient } from './scheduling-dashboard-filters.client'
import {
    SchedulingDashboardStatsSection,
    SchedulingDashboardTableSection,
} from './scheduling-dashboard-parts'

interface SchedulingDashboardPageFeatureProps {
    searchParams: Promise<SearchParamRecord>
}

export async function SchedulingDashboardPageFeature({
    searchParams,
}: SchedulingDashboardPageFeatureProps) {
    const params = await searchParams
    const { filters } = parseSchedulingSearchParams(params)

    return (
        <div className="space-y-4">
            <SchedulingDashboardHeader
                title="Installation Scheduling"
                description="Keep your wrap install calendar tight, predictable, and customer-friendly from booking to bay handoff."
            />
            <WorkspacePageContextCard
                title="Scheduling Actions"
                description="Jump between operator and booking workflows"
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling/manage">Manage Bookings</Link>
                </Button>
                <Button asChild>
                    <Link href="/scheduling/manage/new">Create Booking</Link>
                </Button>
            </WorkspacePageContextCard>
            <Suspense fallback={<SchedulingDashboardStatsSkeleton />}>
                <SchedulingDashboardStatsSection filters={filters} />
            </Suspense>
            <SchedulingDashboardToolbar>
                <SchedulingDashboardFiltersClient />
            </SchedulingDashboardToolbar>
            <Suspense fallback={<SchedulingBookingTableSkeleton />}>
                <SchedulingDashboardTableSection filters={filters} />
            </Suspense>
        </div>
    )
}
