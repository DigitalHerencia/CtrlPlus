import { notFound } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAvailabilityWindows, getBookingById } from '@/lib/fetchers/scheduling.fetchers'

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

            <Card className="border-neutral-800 bg-neutral-950/80">
                <CardHeader>
                    <CardTitle>Lifecycle Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <BookingStatusActionsClient bookingId={booking.id} status={booking.status} />
                </CardContent>
            </Card>
        </div>
    )
}
