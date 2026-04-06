export const WrapImageKind = {
    HERO: 'hero',
    GALLERY: 'gallery',
} as const

export type WrapImageKind = (typeof WrapImageKind)[keyof typeof WrapImageKind]

export const wrapImageKindValues = [
    WrapImageKind.HERO,
    WrapImageKind.GALLERY,
] as const

export const PUBLISH_REQUIRED_WRAP_IMAGE_KINDS = [
    WrapImageKind.HERO,
] as const

export type PublishRequiredWrapImageKind = (typeof PUBLISH_REQUIRED_WRAP_IMAGE_KINDS)[number]

export const PreviewStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const

export type PreviewStatus = (typeof PreviewStatus)[keyof typeof PreviewStatus]

export const previewStatusValues = [
    PreviewStatus.PENDING,
    PreviewStatus.PROCESSING,
    PreviewStatus.COMPLETE,
    PreviewStatus.FAILED,
] as const

const previewStatusSet = new Set<PreviewStatus>(previewStatusValues)

export function normalizePreviewStatus(status: string): PreviewStatus {
    const normalizedStatus = status.toLowerCase() as PreviewStatus

    if (previewStatusSet.has(normalizedStatus)) {
        return normalizedStatus
    }

    return PreviewStatus.FAILED
}

export function isPreviewProcessingStatus(status: PreviewStatus): boolean {
    return status === PreviewStatus.PENDING || status === PreviewStatus.PROCESSING
}

export function isPreviewTerminalStatus(status: PreviewStatus): boolean {
    return status === PreviewStatus.COMPLETE || status === PreviewStatus.FAILED
}

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
