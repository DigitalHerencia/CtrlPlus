import type { SubmitEventHandler } from 'react'

export interface BookingFormAvailabilityWindow {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacity: number
}

export interface BookingFormWrapOption {
    id: string
    name: string
    price: number
}

export interface BookingFormErrors {
    date?: string
    windowId?: string
    wrapId?: string
    root?: string
}

export interface BookingFormProps {
    availabilityWindows: BookingFormAvailabilityWindow[]
    wraps: BookingFormWrapOption[]
    selectedDate: Date | null
    selectedWindowId: string
    selectedWrapId: string
    errors?: BookingFormErrors
    isPending?: boolean
    minDate?: Date
    onSubmit: SubmitEventHandler<HTMLFormElement>
    onDateSelect: (date: Date) => void
    onWindowSelect: (windowId: string) => void
    onWrapSelect: (wrapId: string) => void
}

export interface BookingFormValues {
    date: Date
    windowId: string
    wrapId: string
}

export interface SchedulingBookingFormClientProps {
    availabilityWindows: BookingFormAvailabilityWindow[]
    wraps: BookingFormWrapOption[]
    minDate?: Date
}
