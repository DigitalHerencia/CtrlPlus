import { SchedulingDashboardHeader } from '@/components/scheduling/scheduling-dashboard-header'
import { SchedulingDashboardStats } from '@/components/scheduling/scheduling-dashboard-stats'
import { SchedulingDashboardToolbar } from '@/components/scheduling/scheduling-dashboard-toolbar'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'
import { parseSchedulingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { SchedulingDashboardFiltersClient } from './scheduling-dashboard-filters.client'
import { SchedulingDashboardTableClient } from './scheduling-dashboard-table.client'

interface SchedulingDashboardPageFeatureProps {
    searchParams: Promise<SearchParamRecord>
}

export async function SchedulingDashboardPageFeature({
    searchParams,
}: SchedulingDashboardPageFeatureProps) {
    const params = await searchParams
    const { filters } = parseSchedulingSearchParams(params)

    const [rows, bookings] = await Promise.all([
        getBookingManagerRows(filters),
        getBookings({ ...filters, page: 1, pageSize: 100 }),
    ])

    const pending = bookings.items.filter((item) => item.status === 'pending').length
    const confirmed = bookings.items.filter((item) => item.status === 'confirmed').length
    const completed = bookings.items.filter((item) => item.status === 'completed').length

    return (
        <div className="space-y-4">
            <SchedulingDashboardHeader />
            <SchedulingDashboardStats
                total={bookings.total}
                pending={pending}
                confirmed={confirmed}
                completed={completed}
            />
            <SchedulingDashboardToolbar>
                <SchedulingDashboardFiltersClient />
            </SchedulingDashboardToolbar>
            <SchedulingDashboardTableClient rows={rows} />
        </div>
    )
}
