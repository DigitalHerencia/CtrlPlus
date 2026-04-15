import { redirect } from 'next/navigation'

import { BookingsManagerPageView } from '@/components/scheduling/manage/bookings-manager-page-view'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'
import { parseSchedulingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { BookingsManagerFiltersClient } from './bookings-manager-filters.client'
import { BookingsManagerTableClient } from './bookings-manager-table.client'

interface BookingsManagerPageFeatureProps {
    searchParams: Promise<SearchParamRecord>
}

export async function BookingsManagerPageFeature({
    searchParams,
}: BookingsManagerPageFeatureProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'scheduling.read.all')) {
        redirect('/scheduling')
    }

    const params = await searchParams
    const { filters } = parseSchedulingSearchParams(params)

    const [rows, bookings] = await Promise.all([
        getBookingManagerRows(filters),
        getBookings({ ...filters, page: 1, pageSize: 200 }),
    ])

    const requested = bookings.items.filter(
        (item) => item.status === 'requested' || item.status === 'reschedule_requested'
    ).length
    const confirmed = bookings.items.filter((item) => item.status === 'confirmed').length
    const completed = bookings.items.filter((item) => item.status === 'completed').length

    return (
        <BookingsManagerPageView
            total={bookings.total}
            requested={requested}
            confirmed={confirmed}
            completed={completed}
            filters={<BookingsManagerFiltersClient />}
            table={<BookingsManagerTableClient rows={rows} />}
        />
    )
}
