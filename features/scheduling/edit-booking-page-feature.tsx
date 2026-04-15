import { notFound, redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { createStandardAppointmentWindows } from '@/lib/constants/scheduling'
import { getBookingById } from '@/lib/fetchers/scheduling.fetchers'

import { BookingFormClient } from './booking-form.client'

interface EditBookingPageFeatureProps {
    bookingId?: string
    userId?: string
    params?: Promise<{ bookingId: string }>
}

export async function EditBookingPageFeature({
    bookingId,
    userId,
    params,
}: EditBookingPageFeatureProps) {
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

        if (hasCapability(session.authz, 'scheduling.read.all')) {
            redirect(`/scheduling/manage/${resolvedBookingId}/edit`)
        }

        resolvedUserId = session.userId
    }

    const booking = await getBookingById(resolvedBookingId, { customerId: resolvedUserId })

    if (!booking) {
        notFound()
    }

    const availabilityWindows = createStandardAppointmentWindows()

    return (
        <BookingFormClient
            bookingId={booking.id}
            availabilityWindows={availabilityWindows}
            initialDate={new Date(booking.startTime)}
            initialWindowId={
                availabilityWindows.find(
                    (window) =>
                        window.dayOfWeek === new Date(booking.startTime).getDay() &&
                        window.startTime ===
                            new Date(booking.startTime).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })
                )?.id
            }
        />
    )
}
