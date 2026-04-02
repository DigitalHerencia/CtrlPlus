import { notFound } from 'next/navigation'

import { BookingCommandPanel } from '@/components/scheduling/manage/booking-command-panel'
import { BookingLifecyclePanel } from '@/components/scheduling/manage/booking-lifecycle-panel'
import { getAvailabilityWindows, getBookingById } from '@/lib/fetchers/scheduling.fetchers'

import { BookingNotificationControlsClient } from './booking-notification-controls.client'
import { BookingStatusActionsClient } from './booking-status-actions.client'
import { ManagedBookingFormClient } from './managed-booking-form.client'

interface EditManagedBookingPageFeatureProps {
    bookingId: string
    userId: string
}

export async function EditManagedBookingPageFeature({
    bookingId,
    userId: _userId,
}: EditManagedBookingPageFeatureProps) {
    void _userId

    const [booking, availabilityResult] = await Promise.all([
        getBookingById(bookingId),
        getAvailabilityWindows(),
    ])

    if (!booking) {
        notFound()
    }

    const availabilityWindows = availabilityResult.items.map((window) => ({
        id: window.id,
        dayOfWeek: window.dayOfWeek,
        startTime: window.startTime,
        endTime: window.endTime,
        capacity: window.capacitySlots,
    }))

    return (
        <div className="space-y-4">
            <ManagedBookingFormClient
                booking={booking}
                availabilityWindows={availabilityWindows}
                wraps={[
                    {
                        id: booking.wrapId,
                        name: booking.wrapName ?? 'Wrap',
                        price: booking.totalPrice,
                    },
                ]}
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <BookingLifecyclePanel>
                    <BookingStatusActionsClient bookingId={booking.id} />
                </BookingLifecyclePanel>
                <BookingCommandPanel>
                    <BookingNotificationControlsClient />
                </BookingCommandPanel>
            </div>
        </div>
    )
}
