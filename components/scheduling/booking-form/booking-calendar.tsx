/**
 * @introduction Components — TODO: short one-line summary of booking-calendar.tsx
 *
 * @description TODO: longer description for booking-calendar.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { CalendarClient } from '@/components/scheduling/calendar-client'

interface BookingCalendarProps {
    availableWeekdays: number[]
    selectedDate: Date | null
    minDate?: Date
    onDateSelect: (date: Date) => void
}

/**
 * BookingCalendar — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingCalendar({
    availableWeekdays,
    selectedDate,
    minDate,
    onDateSelect,
}: BookingCalendarProps) {
    return (
        <CalendarClient
            availableWeekdays={availableWeekdays}
            selectedDate={selectedDate}
            minDate={minDate}
            onDateSelect={onDateSelect}
        />
    )
}
