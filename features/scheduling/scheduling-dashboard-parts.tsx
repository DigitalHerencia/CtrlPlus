import { cache } from 'react'

import { SchedulingDashboardStats } from '@/components/scheduling/scheduling-dashboard-stats'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'
import type { BookingListParams } from '@/types/scheduling.types'

import { SchedulingDashboardTableClient } from './scheduling-dashboard-table.client'

const getBookingsForDashboard = cache(async (filters: BookingListParams) => getBookings(filters))

export async function SchedulingDashboardStatsSection({ filters }: { filters: BookingListParams }) {
    // Only show stats for users with scheduling.read.all capability (admin/owner/platform dev)
    const session = await getSession()
    const canViewStats = hasCapability(session.authz, 'scheduling.read.all')

    if (!canViewStats) {
        return null
    }

    const bookings = await getBookingsForDashboard({ ...filters, page: 1, pageSize: 100 })

    const pending = bookings.items.filter(
        (item) => item.status === 'requested' || item.status === 'reschedule_requested'
    ).length
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

export async function SchedulingDashboardTableSection({ filters }: { filters: BookingListParams }) {
    const rows = await getBookingManagerRows(filters)

    return <SchedulingDashboardTableClient rows={rows} />
}
