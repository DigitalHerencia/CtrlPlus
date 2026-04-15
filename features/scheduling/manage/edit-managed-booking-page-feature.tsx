import { notFound, redirect } from 'next/navigation'

import { EditManagedBookingPageView } from '@/components/scheduling/manage/edit-managed-booking-page-view'
import { createStandardAppointmentWindows } from '@/lib/constants/scheduling'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBookingById } from '@/lib/fetchers/scheduling.fetchers'

import { BookingStatusActionsClient } from './booking-status-actions.client'
import { ManagedBookingFormClient } from './managed-booking-form.client'

interface EditManagedBookingPageFeatureProps {
    bookingId?: string
    userId?: string
    params?: Promise<{ bookingId: string }>
}

export async function EditManagedBookingPageFeature({
    bookingId,
    userId,
    params,
}: EditManagedBookingPageFeatureProps) {
    const resolvedBookingId = bookingId ?? (await params)?.bookingId

    if (!resolvedBookingId) {
        notFound()
    }

    if (!userId) {
        const session = await getSession()

        if (!session.isAuthenticated || !session.userId) {
            redirect('/sign-in')
        }

        if (!hasCapability(session.authz, 'scheduling.write.all')) {
            redirect('/scheduling')
        }
    }

    const booking = await getBookingById(resolvedBookingId)

    if (!booking) {
        notFound()
    }

    const availabilityWindows = createStandardAppointmentWindows()

    return (
        <EditManagedBookingPageView
            bookingForm={
                <ManagedBookingFormClient
                    booking={booking}
                    availabilityWindows={availabilityWindows}
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
            }
            lifecycleActions={
                <BookingStatusActionsClient bookingId={booking.id} status={booking.status} />
            }
        />
    )
}
