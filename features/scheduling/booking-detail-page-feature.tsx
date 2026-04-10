import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BookingDetailHeader } from '@/components/scheduling/booking-detail-header'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
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

    const basePath = isManageView ? `/scheduling/manage/${booking.id}` : `/scheduling/${booking.id}`

    return (
        <div className="space-y-6">
            <BookingDetailHeader booking={booking} isManageView={isManageView} />
            <WorkspacePageContextCard
                title="Booking Actions"
                description="Navigate or edit this appointment"
            >
                <Button asChild variant="outline">
                    <Link href={isManageView ? '/scheduling/manage' : '/scheduling'}>Back</Link>
                </Button>
                <Button asChild>
                    <Link href={`${basePath}/edit`}>Edit Booking</Link>
                </Button>
                {isManageView && booking.status === 'completed' ? (
                    <Button asChild variant="outline">
                        <Link href={`/billing/manage/new?bookingId=${booking.id}`}>Issue Invoice</Link>
                    </Button>
                ) : null}
            </WorkspacePageContextCard>
            <BookingDetailTabsClient booking={booking} />
        </div>
    )
}
