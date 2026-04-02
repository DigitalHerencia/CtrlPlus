'use client'

import type { BookingDetailViewDTO } from '@/types/scheduling.types'

import { BookingDetailSummary } from '@/components/scheduling/booking-detail-summary'
import { BookingDetailTabs } from '@/components/scheduling/booking-detail-tabs'
import { BookingDetailTimeline } from '@/components/scheduling/booking-detail-timeline'

interface BookingDetailTabsClientProps {
    booking: BookingDetailViewDTO
}

export function BookingDetailTabsClient({ booking }: BookingDetailTabsClientProps) {
    return (
        <BookingDetailTabs
            summary={<BookingDetailSummary booking={booking} />}
            timeline={<BookingDetailTimeline timeline={booking.timeline} />}
        />
    )
}
