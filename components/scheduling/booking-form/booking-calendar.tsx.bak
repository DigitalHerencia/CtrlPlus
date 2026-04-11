import { CalendarClient } from '@/components/scheduling/calendar-client'

interface BookingCalendarProps {
    availableWeekdays: number[]
    selectedDate: Date | null
    minDate?: Date
    onDateSelect: (date: Date) => void
}

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
