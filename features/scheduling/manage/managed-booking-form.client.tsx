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

/**
 * ManagedBookingFormClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ManagedBookingFormClient({
    availabilityWindows,
    booking,
    initialWindowId,
}: ManagedBookingFormClientProps) {
    const fallbackTimeRanges = [
        ['09:00', '10:00'],
        ['10:00', '11:00'],
        ['11:00', '12:00'],
        ['12:00', '13:00'],
        ['13:00', '14:00'],
        ['14:00', '15:00'],
        ['15:00', '16:00'],
        ['16:00', '17:00'],
    ] as const

    const effectiveAvailabilityWindows =
        availabilityWindows.length > 0
            ? availabilityWindows
            : [0, 1, 2, 3, 4, 5, 6].flatMap((dayOfWeek) =>
                  fallbackTimeRanges.map(([startTime, endTime], index) => ({
                      id: `manage-fallback-${dayOfWeek}-${index}`,
                      dayOfWeek,
                      startTime,
                      endTime,
                      capacity: 4,
                  }))
              )

    return (
        <BookingFormClient
            availabilityWindows={effectiveAvailabilityWindows}
            bookingId={booking.id}
            initialDate={new Date(booking.startTime)}
            initialWindowId={initialWindowId}
            isManageView
        />
    )
}
