import { SchedulingDashboardHeader } from '@/components/scheduling/scheduling-dashboard-header'
import { SchedulingDashboardStats } from '@/components/scheduling/scheduling-dashboard-stats'
import { SchedulingDashboardToolbar } from '@/components/scheduling/scheduling-dashboard-toolbar'
import { BookingStatusValue, VALID_BOOKING_STATUSES } from '@/lib/constants/statuses'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'

import { SchedulingDashboardFiltersClient } from './scheduling-dashboard-filters.client'
import { SchedulingDashboardTableClient } from './scheduling-dashboard-table.client'

interface SchedulingDashboardPageFeatureProps {
    searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>
}

export async function SchedulingDashboardPageFeature({
    searchParams,
}: SchedulingDashboardPageFeatureProps) {
    const params = await searchParams
    const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status
    const status: BookingStatusValue | undefined =
        rawStatus && VALID_BOOKING_STATUSES.has(rawStatus as BookingStatusValue)
            ? (rawStatus as BookingStatusValue)
            : undefined
    const pageRaw = Array.isArray(params.page) ? params.page[0] : params.page
    const page = pageRaw ? Math.max(1, Number(pageRaw) || 1) : 1

    const [rows, bookings] = await Promise.all([
        getBookingManagerRows({ page, pageSize: 20, status }),
        getBookings({ page: 1, pageSize: 100, status }),
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
