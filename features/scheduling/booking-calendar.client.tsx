'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { BookingCalendar } from '@/components/scheduling/booking-form/booking-calendar'

interface BookingCalendarClientProps {
    availableWeekdays: number[]
    selectedDate: Date | null
    minDate?: Date
    onDateSelect: (date: Date) => void
}

/**
 * BookingCalendarClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingCalendarClient(props: BookingCalendarClientProps) {
    return <BookingCalendar {...props} />
}
