import type { SubmitEventHandler } from 'react'

export const BookingStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export type SchedulingBookingDisplayStatus =
    | 'reserved'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'expired'

export type BookingStatusValue = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingDTO {
    id: string
    customerId?: string
    wrapId: string
    wrapName?: string
    startTime: Date
    endTime: Date
    status: BookingStatus
    totalPrice: number
    reservationExpiresAt: Date | null
    displayStatus: SchedulingBookingDisplayStatus
    createdAt: Date
    updatedAt: Date
}

export interface BookingListResult {
    items: BookingDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface BookingListParams {
    page: number
    pageSize: number
    status?: BookingStatusValue
    fromDate?: Date
    toDate?: Date
}

export interface AvailabilityRuleDTO {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Date
    updatedAt: Date
}

export type AvailabilityWindowDTO = AvailabilityRuleDTO

export interface AvailabilityListResult {
    items: AvailabilityRuleDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface AvailabilityListParams {
    page: number
    pageSize: number
    dayOfWeek?: number
}

export interface ReserveSlotInput {
    wrapId: string
    startTime: Date
    endTime: Date
}

export interface ReservedBookingDTO {
    id: string
    wrapId: string
    wrapName?: string
    startTime: Date
    endTime: Date
    status: BookingStatusValue
    totalPrice: number
    reservationExpiresAt: Date
    displayStatus: 'reserved'
}

export interface UpdateBookingInput {
    startTime: Date
    endTime: Date
}

export interface BookingActionDTO {
    id: string
    customerId: string
    wrapId: string
    wrapName?: string
    startTime: Date
    endTime: Date
    status: BookingStatusValue
    totalPrice: number
    reservationExpiresAt: Date | null
    displayStatus: SchedulingBookingDisplayStatus
    createdAt: Date
    updatedAt: Date
}

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
