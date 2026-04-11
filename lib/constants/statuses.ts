/**
 * @introduction Constants — TODO: short one-line summary of statuses.ts
 *
 * @description TODO: longer description for statuses.ts. Keep it short — one or two sentences.
 * Domain: constants
 * Public: TODO (yes/no)
 */
/**
 * WrapImageKind — TODO: brief description.
 */
export const WrapImageKind = {
    HERO: 'hero',
    GALLERY: 'gallery',
} as const

/**
 * WrapImageKind — TODO: brief description of this type.
 */
export type WrapImageKind = (typeof WrapImageKind)[keyof typeof WrapImageKind]

/**
 * wrapImageKindValues — TODO: brief description.
 */
export const wrapImageKindValues = [WrapImageKind.HERO, WrapImageKind.GALLERY] as const

/**
 * PUBLISH_REQUIRED_WRAP_IMAGE_KINDS — TODO: brief description.
 */
export const PUBLISH_REQUIRED_WRAP_IMAGE_KINDS = [WrapImageKind.HERO] as const

/**
 * PublishRequiredWrapImageKind — TODO: brief description of this type.
 */
export type PublishRequiredWrapImageKind = (typeof PUBLISH_REQUIRED_WRAP_IMAGE_KINDS)[number]

/**
 * PreviewStatus — TODO: brief description.
 */
export const PreviewStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const

/**
 * PreviewStatus — TODO: brief description of this type.
 */
export type PreviewStatus = (typeof PreviewStatus)[keyof typeof PreviewStatus]

/**
 * previewStatusValues — TODO: brief description.
 */
export const previewStatusValues = [
    PreviewStatus.PENDING,
    PreviewStatus.PROCESSING,
    PreviewStatus.COMPLETE,
    PreviewStatus.FAILED,
] as const

const previewStatusSet = new Set<PreviewStatus>(previewStatusValues)

/**
 * normalizePreviewStatus — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function normalizePreviewStatus(status: string): PreviewStatus {
    const normalizedStatus = status.toLowerCase() as PreviewStatus

    if (previewStatusSet.has(normalizedStatus)) {
        return normalizedStatus
    }

    return PreviewStatus.FAILED
}

/**
 * isPreviewProcessingStatus — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function isPreviewProcessingStatus(status: PreviewStatus): boolean {
    return status === PreviewStatus.PENDING || status === PreviewStatus.PROCESSING
}

/**
 * isPreviewTerminalStatus — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function isPreviewTerminalStatus(status: PreviewStatus): boolean {
    return status === PreviewStatus.COMPLETE || status === PreviewStatus.FAILED
}

/**
 * VisualizerGenerationMode — TODO: brief description.
 */
export const VisualizerGenerationMode = {
    HUGGING_FACE: 'huggingface',
} as const

/**
 * VisualizerGenerationMode — TODO: brief description of this type.
 */
export type VisualizerGenerationMode =
    (typeof VisualizerGenerationMode)[keyof typeof VisualizerGenerationMode]

/**
 * BookingStatus — TODO: brief description.
 */
export const BookingStatus = {
    REQUESTED: 'requested',
    CONFIRMED: 'confirmed',
    RESCHEDULE_REQUESTED: 'reschedule_requested',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const

/**
 * BookingStatus — TODO: brief description of this type.
 */
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

/**
 * BookingStatusValue — TODO: brief description of this type.
 */
export type BookingStatusValue = (typeof BookingStatus)[keyof typeof BookingStatus]

/**
 * VALID_BOOKING_STATUSES — TODO: brief description.
 */
export const VALID_BOOKING_STATUSES = new Set(Object.values(BookingStatus))

/**
 * SchedulingBookingDisplayStatus — TODO: brief description of this type.
 */
export type SchedulingBookingDisplayStatus =
    | 'requested'
    | 'reschedule_requested'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'expired'

/**
 * normalizeBookingStatus — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function normalizeBookingStatus(status: string): BookingStatusValue {
    if (status === 'pending') {
        return BookingStatus.REQUESTED
    }

    if (VALID_BOOKING_STATUSES.has(status as BookingStatusValue)) {
        return status as BookingStatusValue
    }

    return BookingStatus.REQUESTED
}

/**
 * getBookingDisplayStatus — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getBookingDisplayStatus(
    status: BookingStatusValue,
    reservationExpiresAt: Date | null,
    now: Date = new Date()
): SchedulingBookingDisplayStatus {
    if (status === BookingStatus.REQUESTED) {
        if (reservationExpiresAt && reservationExpiresAt > now) {
            return 'requested'
        }

        return 'expired'
    }

    if (status === BookingStatus.RESCHEDULE_REQUESTED) {
        return 'reschedule_requested'
    }

    return status
}

/**
 * InvoiceStatus — TODO: brief description.
 */
export const InvoiceStatus = {
    DRAFT: 'draft',
    ISSUED: 'issued',
    PAID: 'paid',
    REFUNDED: 'refunded',
    VOID: 'void',
} as const

/**
 * InvoiceStatus — TODO: brief description of this type.
 */
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

/**
 * PaymentStatus — TODO: brief description.
 */
export const PaymentStatus = {
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

/**
 * PaymentStatus — TODO: brief description of this type.
 */
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

/**
 * PAYABLE_INVOICE_STATUSES — TODO: brief description.
 */
export const PAYABLE_INVOICE_STATUSES = new Set<InvoiceStatus>([
    InvoiceStatus.ISSUED,
])

/**
 * isInvoicePayable — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function isInvoicePayable(status: string): boolean {
    return (
        PAYABLE_INVOICE_STATUSES.has(status as InvoiceStatus) ||
        // Legacy statuses kept for backwards compatibility with older persisted rows.
        status === 'sent' ||
        status === 'failed'
    )
}
