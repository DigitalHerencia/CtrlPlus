'use client'


import { BookingCalendar } from '@/components/scheduling/booking-form/booking-calendar'

interface BookingCalendarClientProps {
    availableWeekdays: number[]
    selectedDate: Date | null
    minDate?: Date
    onDateSelect: (date: Date) => void
}


export function BookingCalendarClient(props: BookingCalendarClientProps) {
    return <BookingCalendar {...props} />
}
