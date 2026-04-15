import { notFound, redirect } from 'next/navigation'

import { BookingDetailPageView } from '@/components/scheduling/booking-detail-page-view'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBooking } from '@/lib/fetchers/scheduling.fetchers'

import { BookingDetailTabsClient } from './booking-detail-tabs.client'

interface BookingDetailPageFeatureProps {
    bookingId?: string
    userId?: string
    params?: Promise<{ bookingId: string }>
    isManageView?: boolean
}

export async function BookingDetailPageFeature({
    bookingId,
    userId,
    params,
    isManageView = false,
}: BookingDetailPageFeatureProps) {
    const resolvedBookingId = bookingId ?? (await params)?.bookingId

    if (!resolvedBookingId) {
        notFound()
    }

    let resolvedUserId = userId

    if (!resolvedUserId) {
        const session = await getSession()

        if (!session.isAuthenticated || !session.userId) {
            redirect('/sign-in')
        }

        if (isManageView) {
            if (!hasCapability(session.authz, 'scheduling.read.all')) {
                redirect('/scheduling')
            }
        } else if (hasCapability(session.authz, 'scheduling.read.all')) {
            redirect(`/scheduling/manage/${resolvedBookingId}`)
        }

        resolvedUserId = session.userId
    }

    const booking = await getBooking(
        resolvedBookingId,
        isManageView ? undefined : { customerId: resolvedUserId }
    )

    if (!booking) {
        notFound()
    }

    return (
        <BookingDetailPageView
            booking={booking}
            isManageView={isManageView}
            detailTabs={<BookingDetailTabsClient booking={booking} />}
        />
    )
}
