import { Suspense } from 'react'

import { SchedulingDashboardHeader } from '@/components/scheduling/scheduling-dashboard-header'
import {
    SchedulingBookingTableSkeleton,
    SchedulingDashboardStatsSkeleton,
} from '@/components/scheduling/scheduling-skeletons'
import { SchedulingDashboardToolbar } from '@/components/scheduling/scheduling-dashboard-toolbar'
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
            <SchedulingDashboardHeader />
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
