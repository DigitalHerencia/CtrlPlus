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

export interface BookingTimelineEventDTO {
    id: string
    type: string
    label: string
    createdAt: Timestamp
    actorName: string | null
    notes: string | null
}

export interface BookingDetailViewDTO {
    id: string
    wrapId: string | null
    scheduledAt: Timestamp
    durationMinutes: number
    status: BookingStatus
    customerName: string
    customerEmail: string
    customerPhone: string | null
    notes: string | null
    timeline: BookingTimelineEventDTO[]
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface BookingManagerRowDTO {
    id: string
    wrapId: string | null
    scheduledAt: Timestamp
    durationMinutes: number
    status: BookingStatus
    customerName: string
    customerEmail: string
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

export interface AvailabilitySlotDTO {
    start: Timestamp
    end: Timestamp
    capacity: number
    remainingCapacity: number
    isAvailable: boolean
}

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

export interface CancelBookingInput {
    reason: string
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
