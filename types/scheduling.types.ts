import type {
    BookingStatus,
    BookingStatusValue,
    SchedulingBookingDisplayStatus,
} from '@/lib/constants/statuses'
import type { Timestamp } from './common.types'

/**
 * Scheduling domain — API-facing DTOs
 * Per repository canonical rules: DTO timestamps are ISO strings (Timestamp)
 */
export interface BookingDTO {
    id: string
    customerId?: string
    wrapId: string
    wrapName?: string
    startTime: Timestamp
    endTime: Timestamp
    status: BookingStatus
    totalPrice: number
    reservationExpiresAt: Timestamp | null
    displayStatus: SchedulingBookingDisplayStatus
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface CreatedBookingDTO extends BookingDTO {
    invoiceId: string
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
    fromDate?: Timestamp
    toDate?: Timestamp
}

export interface AvailabilityRuleDTO {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Timestamp
    updatedAt: Timestamp
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
    startTime: Timestamp
    endTime: Timestamp
}

export interface ReservedBookingDTO {
    id: string
    wrapId: string
    wrapName?: string
    startTime: Timestamp
    endTime: Timestamp
    status: BookingStatusValue
    totalPrice: number
    reservationExpiresAt: Timestamp
    displayStatus: 'reserved'
}

export interface UpdateBookingInput {
    startTime: Timestamp
    endTime: Timestamp
}

export interface BookingActionDTO {
    id: string
    customerId: string
    wrapId: string
    wrapName?: string
    startTime: Timestamp
    endTime: Timestamp
    status: BookingStatusValue
    totalPrice: number
    reservationExpiresAt: Timestamp | null
    displayStatus: SchedulingBookingDisplayStatus
    createdAt: Timestamp
    updatedAt: Timestamp
}
