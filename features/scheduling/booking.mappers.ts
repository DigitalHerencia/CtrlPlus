/**
 * @introduction Features — TODO: short one-line summary of booking.mappers.ts
 *
 * @description TODO: longer description for booking.mappers.ts. Keep it short — one or two sentences.
 * Domain: features
 * Public: TODO (yes/no)
 */
import type { BookingCardItem } from '@/components/scheduling/booking-card'
import type { BookingDTO } from '@/types/scheduling.types'

/**
 * toBookingCardItem — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function toBookingCardItem(booking: BookingDTO): BookingCardItem {
    return {
        id: booking.id,
        wrapId: booking.wrapId,
        wrapName: booking.wrapName,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        status: booking.status,
        displayStatus: booking.displayStatus,
        reservationExpiresAt: booking.reservationExpiresAt
            ? new Date(booking.reservationExpiresAt)
            : null,
        totalPrice: booking.totalPrice,
    }
}
