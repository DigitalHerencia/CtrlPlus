/**
 * @introduction Types — TODO: short one-line summary of scheduling.client.types.ts
 *
 * @description TODO: longer description for scheduling.client.types.ts. Keep it short — one or two sentences.
 * Domain: types
 * Public: TODO (yes/no)
 */
import type { SubmitEventHandler } from 'react'

/**
 * BookingFormAvailabilityWindow — TODO: brief description of this type.
 */
/**
 * BookingFormAvailabilityWindow — TODO: brief description of this type.
 */
/**
 * BookingFormAvailabilityWindow — TODO: brief description of this type.
 */
export interface BookingFormAvailabilityWindow {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacity: number
}

/**
 * BookingFormWrapOption — TODO: brief description of this type.
 */
/**
 * BookingFormWrapOption — TODO: brief description of this type.
 */
/**
 * BookingFormWrapOption — TODO: brief description of this type.
 */
export interface BookingFormWrapOption {
    id: string
    name: string
    price: number
}

/**
 * BookingFormErrors — TODO: brief description of this type.
 */
/**
 * BookingFormErrors — TODO: brief description of this type.
 */
/**
 * BookingFormErrors — TODO: brief description of this type.
 */
export interface BookingFormErrors {
    date?: string
    windowId?: string
    wrapId?: string
    root?: string
}

/**
 * BookingFormProps — TODO: brief description of this type.
 */
/**
 * BookingFormProps — TODO: brief description of this type.
 */
/**
 * BookingFormProps — TODO: brief description of this type.
 */
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

/**
 * BookingFormValues — TODO: brief description of this type.
 */
/**
 * BookingFormValues — TODO: brief description of this type.
 */
/**
 * BookingFormValues — TODO: brief description of this type.
 */
export interface BookingFormValues {
    date: Date
    windowId: string
    wrapId: string
}

/**
 * SchedulingBookingFormClientProps — TODO: brief description of this type.
 */
/**
 * SchedulingBookingFormClientProps — TODO: brief description of this type.
 */
/**
 * SchedulingBookingFormClientProps — TODO: brief description of this type.
 */
export interface SchedulingBookingFormClientProps {
    availabilityWindows: BookingFormAvailabilityWindow[]
    wraps: BookingFormWrapOption[]
    minDate?: Date
}
