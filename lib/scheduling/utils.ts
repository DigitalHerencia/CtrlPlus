import type { BookingStatusValue, SchedulingBookingDisplayStatus } from '@/types/scheduling'

/**
 * Formats a Date as a zero-padded "HH:mm" string in UTC.
 *
 * The result is suitable for lexicographic comparison with AvailabilityRule
 * `startTime`/`endTime` strings (both are zero-padded "HH:mm" in 24-hour
 * format, so "09:00" < "10:00" < "17:00" sorts correctly as strings).
 */
export function toHHmm(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}

export function getBookingDisplayStatus(
    status: BookingStatusValue,
    reservationExpiresAt: Date | null,
    now: Date = new Date()
): SchedulingBookingDisplayStatus {
    if (status === 'pending') {
        if (reservationExpiresAt && reservationExpiresAt > now) {
            return 'reserved'
        }

        return 'expired'
    }

    return status
}
