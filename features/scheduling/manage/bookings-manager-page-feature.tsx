import Link from 'next/link'
import { CalendarClock, CircleCheckBig, FolderClock, RotateCw } from 'lucide-react'

import {
    WorkspaceMetricCard,
    WorkspacePageContextCard,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
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
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="Manage Appointments"
                description="Coordinate customer appointment requests, confirm install times, and keep the schedule aligned with real shop capacity."
            />
            <WorkspacePageContextCard
                title="Operator Actions"
                description="Review the customer-facing appointment experience when needed, then return here for owner/admin coordination."
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling">Customer View</Link>
                </Button>
            </WorkspacePageContextCard>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6 lg:gap-8">
                <WorkspaceMetricCard
                    label="Total Appointments"
                    value={bookings.total}
                    description="Visible inside the active manager filters."
                    icon={CalendarClock}
                />
                <WorkspaceMetricCard
                    label="Requested"
                    value={requested}
                    description="Requests still waiting on owner/admin review."
                    icon={FolderClock}
                />
                <WorkspaceMetricCard
                    label="Confirmed"
                    value={confirmed}
                    description="Install times already approved and ready for the bay."
                    icon={CircleCheckBig}
                />
                <WorkspaceMetricCard
                    label="Completed"
                    value={completed}
                    description="Finished appointments ready for billing follow-through."
                    icon={RotateCw}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 border border-neutral-700 bg-neutral-950/80 px-6 py-6">
                <BookingsManagerFiltersClient />
            </div>

            <BookingsManagerTableClient rows={rows} />
        </div>
    )
}

