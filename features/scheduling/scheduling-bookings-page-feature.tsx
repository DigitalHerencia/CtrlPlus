import 'server-only'

import { redirect } from 'next/navigation'

import { SchedulingBookingsPageView } from '@/components/scheduling/scheduling-bookings-page-view'
import { cancelBooking } from '@/lib/actions/scheduling.actions'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBookings } from '@/lib/fetchers/scheduling.fetchers'
import { getTenantLocationView } from '@/lib/fetchers/settings.fetchers'

import { toBookingCardItem } from './booking.mappers'

interface SchedulingBookingsPageFeatureProps {
    tab?: 'upcoming' | 'past'
    userId?: string
}

const CUSTOMER_ACTIONABLE_STATUSES = new Set([
    'reserved',
    'requested',
    'confirmed',
    'expired',
    'reschedule_requested',
])

function buildLocationLabel(location: {
    businessName: string | null
    address: string | null
}): string {
    return [location.businessName, location.address].filter(Boolean).join(' • ')
}

export function createCustomerCancelBookingAction(tab: 'upcoming' | 'past') {
    return async function cancelCustomerBooking(formData: FormData) {
        'use server'

        const bookingId = formData.get('bookingId')

        if (typeof bookingId !== 'string' || bookingId.length === 0) {
            throw new Error('Booking id is required')
        }

        await cancelBooking(bookingId, {
            reason: 'Cancelled by customer from My Appointments',
        })

        redirect(`/scheduling?tab=${tab}`)
    }
}

export async function SchedulingBookingsPageFeature({
    userId,
}: SchedulingBookingsPageFeatureProps) {
    let resolvedUserId = userId

    if (!resolvedUserId) {
        const session = await getSession()

        if (!session.isAuthenticated || !session.userId) {
            redirect('/sign-in')
        }

        if (hasCapability(session.authz, 'scheduling.read.all')) {
            redirect('/scheduling/manage')
        }

        resolvedUserId = session.userId
    }

    const nowIso = new Date().toISOString()
    const [bookingsResult, tenantLocation] = await Promise.all([
        getBookings({ page: 1, pageSize: 20, fromDate: nowIso }, { customerId: resolvedUserId }),
        getTenantLocationView(),
    ])

    const bookings = bookingsResult.items.map(toBookingCardItem)
    const isUpcoming = true
    const cancelAction = createCustomerCancelBookingAction('upcoming')
    const locationLabel = buildLocationLabel(tenantLocation) || 'Location shared after confirmation'
    const bookingItems = bookings.map((booking) => {
        const displayStatus = String(booking.displayStatus ?? booking.status)
        const canManageFromList =
            isUpcoming &&
            CUSTOMER_ACTIONABLE_STATUSES.has(displayStatus) &&
            displayStatus !== 'cancelled' &&
            displayStatus !== 'completed'

        return {
            booking,
            canManageFromList,
        }
    })

    return (
        <SchedulingBookingsPageView
            isUpcoming={isUpcoming}
            bookings={bookingItems}
            locationLabel={locationLabel}
            cancelAction={cancelAction}
        />
    )
}
