import { BookingsManagerHeader } from '@/components/scheduling/manage/bookings-manager-header'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { BookingsManagerStats } from '@/components/scheduling/manage/bookings-manager-stats'
import { getBookings, getBookingManagerRows } from '@/lib/fetchers/scheduling.fetchers'
import { parseSchedulingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'
import Link from 'next/link'

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
        <div className="space-y-6">
            <BookingsManagerHeader />
            <WorkspacePageContextCard
                title="Manager Actions"
                description="Switch to customer calendar or create a new booking"
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling">Customer View</Link>
                </Button>
                <Button asChild>
                    <Link href="/scheduling/manage/new">Create Booking</Link>
                </Button>
            </WorkspacePageContextCard>
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
