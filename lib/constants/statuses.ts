export const WrapStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DRAFT: 'DRAFT',
} as const

export type WrapStatus = (typeof WrapStatus)[keyof typeof WrapStatus]

export const WrapCategory = {
    FULL_WRAP: 'FULL_WRAP',
    PARTIAL_WRAP: 'PARTIAL_WRAP',
    ACCENT: 'ACCENT',
    PAINT_PROTECTION_FILM: 'PAINT_PROTECTION_FILM',
} as const

export type WrapCategory = (typeof WrapCategory)[keyof typeof WrapCategory]

export const WrapImageKind = {
    HERO: 'hero',
    VISUALIZER_TEXTURE: 'visualizer_texture',
    VISUALIZER_MASK_HINT: 'visualizer_mask_hint',
    GALLERY: 'gallery',
} as const

export type WrapImageKind = (typeof WrapImageKind)[keyof typeof WrapImageKind]

export const wrapImageKindValues = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
    WrapImageKind.VISUALIZER_MASK_HINT,
    WrapImageKind.GALLERY,
] as const

export const PUBLISH_REQUIRED_WRAP_IMAGE_KINDS = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
] as const

export type PublishRequiredWrapImageKind = (typeof PUBLISH_REQUIRED_WRAP_IMAGE_KINDS)[number]

export const PreviewStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const

export type PreviewStatus = (typeof PreviewStatus)[keyof typeof PreviewStatus]

export const VisualizerGenerationMode = {
    HUGGING_FACE: 'huggingface',
    DETERMINISTIC_FALLBACK: 'deterministic_fallback',
} as const

export type VisualizerGenerationMode =
    (typeof VisualizerGenerationMode)[keyof typeof VisualizerGenerationMode]

export const BookingStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export type BookingStatusValue = (typeof BookingStatus)[keyof typeof BookingStatus]

export const VALID_BOOKING_STATUSES = new Set(Object.values(BookingStatus))

export type SchedulingBookingDisplayStatus =
    | 'reserved'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'expired'

export function getBookingDisplayStatus(
    status: BookingStatusValue,
    reservationExpiresAt: Date | null,
    now: Date = new Date()
): SchedulingBookingDisplayStatus {
    if (status === BookingStatus.PENDING) {
        if (reservationExpiresAt && reservationExpiresAt > now) {
            return 'reserved'
        }

        return 'expired'
    }

    return status
}

export const InvoiceStatus = {
    DRAFT: 'draft',
    ISSUED: 'issued',
    PAID: 'paid',
    REFUNDED: 'refunded',
    VOID: 'void',
} as const

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

export const PaymentStatus = {
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

export const PAYABLE_INVOICE_STATUSES = new Set<InvoiceStatus>([
    InvoiceStatus.DRAFT,
    InvoiceStatus.ISSUED,
])

export function isInvoicePayable(status: string): boolean {
    return (
        PAYABLE_INVOICE_STATUSES.has(status as InvoiceStatus) ||
        // Legacy statuses kept for backwards compatibility with older persisted rows.
        status === 'sent' ||
        status === 'failed'
    )
}
