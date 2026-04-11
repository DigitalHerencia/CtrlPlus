'use client'

import type { BookingDTO } from '@/types/scheduling.types'

import { BookingFormClient } from '../booking-form.client'

interface ManagedBookingFormClientProps {
    availabilityWindows: Array<{
        id: string
        dayOfWeek: number
        startTime: string
        endTime: string
        capacity: number
    }>
    wraps: Array<{ id: string; name: string; price: number }>
    booking?: BookingDTO
}

export function ManagedBookingFormClient({
    availabilityWindows,
    wraps,
    booking,
}: ManagedBookingFormClientProps) {
    return (
        <BookingFormClient
            availabilityWindows={availabilityWindows}
            wraps={wraps}
            bookingId={booking?.id}
            initialDate={booking ? new Date(booking.startTime) : undefined}
            isManageView
        />
    )
}
