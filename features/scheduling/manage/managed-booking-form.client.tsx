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
    booking: BookingDTO
    initialWindowId?: string
}


export function ManagedBookingFormClient({
    availabilityWindows,
    booking,
    initialWindowId,
}: ManagedBookingFormClientProps) {
    return (
        <BookingFormClient
            availabilityWindows={availabilityWindows}
            bookingId={booking.id}
            initialDate={new Date(booking.startTime)}
            initialWindowId={initialWindowId}
            isManageView
        />
    )
}
