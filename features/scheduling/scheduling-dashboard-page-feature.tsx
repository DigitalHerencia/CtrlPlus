import Link from 'next/link'
import { Suspense } from 'react'

import { SchedulingDashboardHeader } from '@/components/scheduling/scheduling-dashboard-header'
import {
    SchedulingBookingTableSkeleton,
    SchedulingDashboardStatsSkeleton,
} from '@/components/scheduling/scheduling-skeletons'
import { SchedulingDashboardToolbar } from '@/components/scheduling/scheduling-dashboard-toolbar'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { parseSchedulingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { SchedulingDashboardFiltersClient } from './scheduling-dashboard-filters.client'
import {
    SchedulingDashboardStatsSection,
    SchedulingDashboardTableSection,
} from './scheduling-dashboard-parts'

interface SchedulingDashboardPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function SchedulingDashboardPageFeature({
    searchParams,
}: SchedulingDashboardPageFeatureProps) {
    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parseSchedulingSearchParams(resolvedParams)

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <SchedulingDashboardHeader
                label="Scheduling"
                title="Installation Scheduling"
                description="Keep your wrap install calendar tight, predictable, and customer-friendly from booking to bay handoff."
            />

            {/* Actions Section */}
            <WorkspacePageContextCard
                title="Scheduling Actions"
                description="Jump between operator and booking workflows"
            >
                <Button asChild>
                    <Link href="/scheduling/manage/new">Create Booking</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/scheduling/manage">Manage Bookings</Link>
                </Button>
            </WorkspacePageContextCard>

            {/* KPI Cards Section */}
            <Suspense fallback={<SchedulingDashboardStatsSkeleton />}>
                <SchedulingDashboardStatsSection filters={filters} />
            </Suspense>

            {/* Filters Section */}
            <SchedulingDashboardToolbar>
                <SchedulingDashboardFiltersClient />
            </SchedulingDashboardToolbar>

            {/* Results Section */}
            <Suspense fallback={<SchedulingBookingTableSkeleton />}>
                <SchedulingDashboardTableSection filters={filters} />
            </Suspense>
        </div>
    )
}
