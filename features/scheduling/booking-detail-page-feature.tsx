import { notFound } from 'next/navigation'

import { BookingDetailHeader } from '@/components/scheduling/booking-detail-header'
import { getBooking } from '@/lib/fetchers/scheduling.fetchers'

import { BookingDetailTabsClient } from './booking-detail-tabs.client'

interface BookingDetailPageFeatureProps {
    bookingId: string
    userId: string
    isManageView?: boolean
}

export async function BookingDetailPageFeature({
    bookingId,
    userId,
    isManageView = false,
}: BookingDetailPageFeatureProps) {
    const booking = await getBooking(bookingId, userId)

    if (!booking) {
        notFound()
    }

    return (
        <div className="space-y-4">
            <BookingDetailHeader booking={booking} isManageView={isManageView} />
            <BookingDetailTabsClient booking={booking} />
        </div>
    )
}
