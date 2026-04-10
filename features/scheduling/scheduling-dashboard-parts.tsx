import { SchedulingDashboardStats } from '@/components/scheduling/scheduling-dashboard-stats'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'
import type { BookingListParams } from '@/types/scheduling.types'

import { SchedulingDashboardTableClient } from './scheduling-dashboard-table.client'

export async function SchedulingDashboardStatsSection({
    filters,
}: {
    filters: BookingListParams
}) {
    const bookings = await getBookings({ ...filters, page: 1, pageSize: 100 })

    const pending = bookings.items.filter((item) => item.status === 'requested' || item.status === 'reschedule_requested').length
    const confirmed = bookings.items.filter((item) => item.status === 'confirmed').length
    const completed = bookings.items.filter((item) => item.status === 'completed').length

    return (
        <SchedulingDashboardStats
            total={bookings.total}
            pending={pending}
            confirmed={confirmed}
            completed={completed}
        />
    )
}

export async function SchedulingDashboardTableSection({
    filters,
}: {
    filters: BookingListParams
}) {
    const rows = await getBookingManagerRows(filters)

    return <SchedulingDashboardTableClient rows={rows} />
}

