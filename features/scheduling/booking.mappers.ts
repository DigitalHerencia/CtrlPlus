
import type { BookingCardItem } from '@/components/scheduling/booking-card'
import type { BookingDTO } from '@/types/scheduling.types'


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
