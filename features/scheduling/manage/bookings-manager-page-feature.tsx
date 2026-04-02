import { BookingsManagerHeader } from '@/components/scheduling/manage/bookings-manager-header'
import { BookingsManagerStats } from '@/components/scheduling/manage/bookings-manager-stats'
import { BookingStatusValue } from '@/lib/constants/statuses'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'

import { BookingsManagerBulkActionsClient } from './bookings-manager-bulk-actions.client'
import { BookingsManagerTableClient } from './bookings-manager-table.client'
import { BookingsManagerToolbarClient } from './bookings-manager-toolbar.client'

interface BookingsManagerPageFeatureProps {
    searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>
}

const VALID_STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled'])

export async function BookingsManagerPageFeature({
    searchParams,
}: BookingsManagerPageFeatureProps) {
    const params = await searchParams
    const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status
    const status: BookingStatusValue | undefined =
        rawStatus && VALID_STATUSES.has(rawStatus) ? (rawStatus as BookingStatusValue) : undefined
    const pageRaw = Array.isArray(params.page) ? params.page[0] : params.page
    const page = pageRaw ? Math.max(1, Number(pageRaw) || 1) : 1

    const [rows, bookings] = await Promise.all([
        getBookingManagerRows({ page, pageSize: 20, status }),
        getBookings({ page: 1, pageSize: 200, status }),
    ])

    const pending = bookings.items.filter((item) => item.status === 'pending').length
    const confirmed = bookings.items.filter((item) => item.status === 'confirmed').length
    const cancelled = bookings.items.filter((item) => item.status === 'cancelled').length

    return (
        <div className="space-y-4">
            <BookingsManagerHeader />
            <BookingsManagerStats
                total={bookings.total}
                pending={pending}
                confirmed={confirmed}
                cancelled={cancelled}
            />
            <BookingsManagerToolbarClient />
            <BookingsManagerBulkActionsClient />
            <BookingsManagerTableClient rows={rows} />
        </div>
    )
}
