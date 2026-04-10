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
    customerName?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    preferredContact?: 'email' | 'sms' | null
    billingAddressLine1?: string | null
    billingAddressLine2?: string | null
    billingCity?: string | null
    billingState?: string | null
    billingPostalCode?: string | null
    billingCountry?: string | null
    vehicleMake?: string | null
    vehicleModel?: string | null
    vehicleYear?: string | null
    vehicleTrim?: string | null
    previewImageUrl?: string | null
    previewPromptUsed?: string | null
    notes?: string | null
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface BookingDraftDTO {
    id: string
    customerId: string
    wrapId: string
    wrapNameSnapshot: string
    wrapPriceSnapshot: number
    vehicleMake: string | null
    vehicleModel: string | null
    vehicleYear: string | null
    vehicleTrim: string | null
    previewImageUrl: string | null
    previewPromptUsed: string | null
    previewStatus: string | null
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
    wrapName: string | null
    scheduledAt: Timestamp
    estimatedPickupAt: Timestamp
    durationMinutes: number
    status: BookingStatus
    customerName: string
    customerEmail: string
    customerPhone: string | null
    preferredContact: 'email' | 'sms' | null
    billingAddressLine1: string | null
    billingAddressLine2: string | null
    billingCity: string | null
    billingState: string | null
    billingPostalCode: string | null
    billingCountry: string | null
    vehicleMake: string | null
    vehicleModel: string | null
    vehicleYear: string | null
    vehicleTrim: string | null
    previewImageUrl: string | null
    previewPromptUsed: string | null
    notes: string | null
    timeline: BookingTimelineEventDTO[]
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface BookingManagerRowDTO {
    id: string
    wrapId: string | null
    wrapName: string | null
    scheduledAt: Timestamp
    estimatedPickupAt: Timestamp
    durationMinutes: number
    status: BookingStatus
    customerName: string
    customerEmail: string
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type CreatedBookingDTO = BookingDTO

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

export interface CreateBookingInput extends ReserveSlotInput {
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    preferredContact: 'email' | 'sms'
    billingAddressLine1: string
    billingAddressLine2?: string | null
    billingCity: string
    billingState: string
    billingPostalCode: string
    billingCountry: string
    vehicleMake: string
    vehicleModel: string
    vehicleYear: string
    vehicleTrim?: string | null
    previewImageUrl?: string | null
    previewPromptUsed?: string | null
    notes?: string | null
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
