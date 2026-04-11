/**
 * @introduction Types — TODO: short one-line summary of scheduling.types.ts
 *
 * @description TODO: longer description for scheduling.types.ts. Keep it short — one or two sentences.
 * Domain: types
 * Public: TODO (yes/no)
 */
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
/**
 * BookingDTO — TODO: brief description of this type.
 */
/**
 * BookingDTO — TODO: brief description of this type.
 */
/**
 * BookingDTO — TODO: brief description of this type.
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

/**
 * BookingDraftDTO — TODO: brief description of this type.
 */
/**
 * BookingDraftDTO — TODO: brief description of this type.
 */
/**
 * BookingDraftDTO — TODO: brief description of this type.
 */
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

/**
 * BookingTimelineEventDTO — TODO: brief description of this type.
 */
/**
 * BookingTimelineEventDTO — TODO: brief description of this type.
 */
/**
 * BookingTimelineEventDTO — TODO: brief description of this type.
 */
export interface BookingTimelineEventDTO {
    id: string
    type: string
    label: string
    createdAt: Timestamp
    actorName: string | null
    notes: string | null
}

/**
 * BookingDetailViewDTO — TODO: brief description of this type.
 */
/**
 * BookingDetailViewDTO — TODO: brief description of this type.
 */
/**
 * BookingDetailViewDTO — TODO: brief description of this type.
 */
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

/**
 * BookingManagerRowDTO — TODO: brief description of this type.
 */
/**
 * BookingManagerRowDTO — TODO: brief description of this type.
 */
/**
 * BookingManagerRowDTO — TODO: brief description of this type.
 */
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

/**
 * CreatedBookingDTO — TODO: brief description of this type.
 */
/**
 * CreatedBookingDTO — TODO: brief description of this type.
 */
/**
 * CreatedBookingDTO — TODO: brief description of this type.
 */
export type CreatedBookingDTO = BookingDTO

/**
 * BookingListResult — TODO: brief description of this type.
 */
/**
 * BookingListResult — TODO: brief description of this type.
 */
/**
 * BookingListResult — TODO: brief description of this type.
 */
export interface BookingListResult {
    items: BookingDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * BookingListParams — TODO: brief description of this type.
 */
/**
 * BookingListParams — TODO: brief description of this type.
 */
/**
 * BookingListParams — TODO: brief description of this type.
 */
export interface BookingListParams {
    page: number
    pageSize: number
    status?: BookingStatusValue
    fromDate?: Timestamp
    toDate?: Timestamp
}

/**
 * AvailabilityRuleDTO — TODO: brief description of this type.
 */
/**
 * AvailabilityRuleDTO — TODO: brief description of this type.
 */
/**
 * AvailabilityRuleDTO — TODO: brief description of this type.
 */
export interface AvailabilityRuleDTO {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Timestamp
    updatedAt: Timestamp
}

/**
 * AvailabilityWindowDTO — TODO: brief description of this type.
 */
/**
 * AvailabilityWindowDTO — TODO: brief description of this type.
 */
/**
 * AvailabilityWindowDTO — TODO: brief description of this type.
 */
export type AvailabilityWindowDTO = AvailabilityRuleDTO

/**
 * AvailabilitySlotDTO — TODO: brief description of this type.
 */
/**
 * AvailabilitySlotDTO — TODO: brief description of this type.
 */
/**
 * AvailabilitySlotDTO — TODO: brief description of this type.
 */
export interface AvailabilitySlotDTO {
    start: Timestamp
    end: Timestamp
    capacity: number
    remainingCapacity: number
    isAvailable: boolean
}

/**
 * AvailabilityListResult — TODO: brief description of this type.
 */
/**
 * AvailabilityListResult — TODO: brief description of this type.
 */
/**
 * AvailabilityListResult — TODO: brief description of this type.
 */
export interface AvailabilityListResult {
    items: AvailabilityRuleDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * AvailabilityListParams — TODO: brief description of this type.
 */
/**
 * AvailabilityListParams — TODO: brief description of this type.
 */
/**
 * AvailabilityListParams — TODO: brief description of this type.
 */
export interface AvailabilityListParams {
    page: number
    pageSize: number
    dayOfWeek?: number
}

/**
 * ReserveSlotInput — TODO: brief description of this type.
 */
/**
 * ReserveSlotInput — TODO: brief description of this type.
 */
/**
 * ReserveSlotInput — TODO: brief description of this type.
 */
export interface ReserveSlotInput {
    wrapId: string
    startTime: Timestamp
    endTime: Timestamp
}

/**
 * CreateBookingInput — TODO: brief description of this type.
 */
/**
 * CreateBookingInput — TODO: brief description of this type.
 */
/**
 * CreateBookingInput — TODO: brief description of this type.
 */
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

/**
 * ReservedBookingDTO — TODO: brief description of this type.
 */
/**
 * ReservedBookingDTO — TODO: brief description of this type.
 */
/**
 * ReservedBookingDTO — TODO: brief description of this type.
 */
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

/**
 * UpdateBookingInput — TODO: brief description of this type.
 */
/**
 * UpdateBookingInput — TODO: brief description of this type.
 */
/**
 * UpdateBookingInput — TODO: brief description of this type.
 */
export interface UpdateBookingInput {
    startTime: Timestamp
    endTime: Timestamp
}

/**
 * CancelBookingInput — TODO: brief description of this type.
 */
/**
 * CancelBookingInput — TODO: brief description of this type.
 */
/**
 * CancelBookingInput — TODO: brief description of this type.
 */
export interface CancelBookingInput {
    reason: string
}

/**
 * BookingActionDTO — TODO: brief description of this type.
 */
/**
 * BookingActionDTO — TODO: brief description of this type.
 */
/**
 * BookingActionDTO — TODO: brief description of this type.
 */
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
