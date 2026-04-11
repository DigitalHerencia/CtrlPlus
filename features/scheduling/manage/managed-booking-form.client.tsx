'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

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

/**
 * ManagedBookingFormClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
