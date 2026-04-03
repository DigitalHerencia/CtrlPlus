import { BookingsManagerHeader } from '@/components/scheduling/manage/bookings-manager-header'
import { BookingsManagerStats } from '@/components/scheduling/manage/bookings-manager-stats'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'
import { parseSchedulingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { BookingsManagerBulkActionsClient } from './bookings-manager-bulk-actions.client'
import { BookingsManagerTableClient } from './bookings-manager-table.client'
import { BookingsManagerToolbarClient } from './bookings-manager-toolbar.client'

interface BookingsManagerPageFeatureProps {
    searchParams: Promise<SearchParamRecord>
}

export async function BookingsManagerPageFeature({
    searchParams,
}: BookingsManagerPageFeatureProps) {
    const params = await searchParams
    const { filters } = parseSchedulingSearchParams(params)

    const [rows, bookings] = await Promise.all([
        getBookingManagerRows(filters),
        getBookings({ ...filters, page: 1, pageSize: 200 }),
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
