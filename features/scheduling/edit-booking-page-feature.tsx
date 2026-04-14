import { notFound } from 'next/navigation'

import { getAvailabilityWindows, getBookingById } from '@/lib/fetchers/scheduling.fetchers'

import { BookingFormClient } from './booking-form.client'

interface EditBookingPageFeatureProps {
    bookingId: string
    userId: string
}

export async function EditBookingPageFeature({
    bookingId,
    userId,
}: EditBookingPageFeatureProps) {
    const [booking, availabilityResult] = await Promise.all([
        getBookingById(bookingId, { customerId: userId }),
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
