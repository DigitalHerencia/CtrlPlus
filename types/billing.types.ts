/**
 * @introduction Types — TODO: short one-line summary of billing.types.ts
 *
 * @description TODO: longer description for billing.types.ts. Keep it short — one or two sentences.
 * Domain: types
 * Public: TODO (yes/no)
 */
import type { InvoiceStatus, PaymentStatus } from '@/lib/constants/statuses'
import type { Timestamp } from './common.types'

/**
 * InvoiceLineItemDTO — TODO: brief description of this type.
 */
/**
 * InvoiceLineItemDTO — TODO: brief description of this type.
 */
/**
 * InvoiceLineItemDTO — TODO: brief description of this type.
 */
export interface InvoiceLineItemDTO {
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
}

/**
 * InvoiceDTO — TODO: brief description of this type.
 */
/**
 * InvoiceDTO — TODO: brief description of this type.
 */
/**
 * InvoiceDTO — TODO: brief description of this type.
 */
export interface InvoiceDTO {
    id: string
    customerId?: string
    bookingId: string
    status: InvoiceStatus
    totalAmount: number
    subtotalAmount?: number | null
    taxAmount?: number | null
    dueDate?: Timestamp | null
    issuedAt?: Timestamp | null
    stripeCheckoutSessionId?: string | null
    stripeCustomerId?: string | null
    createdAt: Timestamp
    updatedAt: Timestamp
}

/**
 * InvoicePaymentEventDTO — TODO: brief description of this type.
 */
/**
 * InvoicePaymentEventDTO — TODO: brief description of this type.
 */
/**
 * InvoicePaymentEventDTO — TODO: brief description of this type.
 */
export interface InvoicePaymentEventDTO {
    id: string
    type: 'payment' | 'refund' | 'credit' | 'void'
    amount: number
    createdAt: Timestamp
    providerReference: string | null
    notes: string | null
}

/**
 * InvoiceDetailViewDTO — TODO: brief description of this type.
 */
/**
 * InvoiceDetailViewDTO — TODO: brief description of this type.
 */
/**
 * InvoiceDetailViewDTO — TODO: brief description of this type.
 */
export interface InvoiceDetailViewDTO extends InvoiceDTO {
    lineItems: InvoiceLineItemDTO[]
    paymentHistory: InvoicePaymentEventDTO[]
}

/**
 * InvoiceDetailDTO — TODO: brief description of this type.
 */
/**
 * InvoiceDetailDTO — TODO: brief description of this type.
 */
/**
 * InvoiceDetailDTO — TODO: brief description of this type.
 */
export interface InvoiceDetailDTO extends InvoiceDetailViewDTO {
    // Backwards-compatible alias for existing components/tests.
    payments: PaymentDTO[]
}

/**
 * InvoiceManagerRowDTO — TODO: brief description of this type.
 */
/**
 * InvoiceManagerRowDTO — TODO: brief description of this type.
 */
/**
 * InvoiceManagerRowDTO — TODO: brief description of this type.
 */
export type InvoiceManagerRowDTO = InvoiceDTO

/**
 * PaymentDTO — TODO: brief description of this type.
 */
/**
 * PaymentDTO — TODO: brief description of this type.
 */
/**
 * PaymentDTO — TODO: brief description of this type.
 */
export interface PaymentDTO {
    id: string
    invoiceId: string
    stripePaymentIntentId: string
    status: PaymentStatus
    amount: number
    createdAt: Timestamp
}

/**
 * InvoiceListParams — TODO: brief description of this type.
 */
/**
 * InvoiceListParams — TODO: brief description of this type.
 */
/**
 * InvoiceListParams — TODO: brief description of this type.
 */
export interface InvoiceListParams {
    page: number
    pageSize: number
    status?: InvoiceStatus
    query?: string
}

/**
 * InvoiceListResult — TODO: brief description of this type.
 */
/**
 * InvoiceListResult — TODO: brief description of this type.
 */
/**
 * InvoiceListResult — TODO: brief description of this type.
 */
export interface InvoiceListResult {
    invoices: InvoiceDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * CheckoutSessionDTO — TODO: brief description of this type.
 */
/**
 * CheckoutSessionDTO — TODO: brief description of this type.
 */
/**
 * CheckoutSessionDTO — TODO: brief description of this type.
 */
export interface CheckoutSessionDTO {
    sessionId: string
    url: string
    invoiceId: string
}

/**
 * ConfirmPaymentResult — TODO: brief description of this type.
 */
/**
 * ConfirmPaymentResult — TODO: brief description of this type.
 */
/**
 * ConfirmPaymentResult — TODO: brief description of this type.
 */
export interface ConfirmPaymentResult {
    invoiceId: string
    paymentId: string
    status: 'pending' | 'succeeded' | 'failed'
}

/**
 * BillingBalanceDTO — TODO: brief description of this type.
 */
/**
 * BillingBalanceDTO — TODO: brief description of this type.
 */
/**
 * BillingBalanceDTO — TODO: brief description of this type.
 */
export interface BillingBalanceDTO {
    outstandingAmount: number
    creditAmount: number
    currency: string
}

/**
 * EnsureInvoiceForBookingInput — TODO: brief description of this type.
 */
/**
 * EnsureInvoiceForBookingInput — TODO: brief description of this type.
 */
/**
 * EnsureInvoiceForBookingInput — TODO: brief description of this type.
 */
export interface EnsureInvoiceForBookingInput {
    bookingId: string
}

/**
 * CreateInvoiceInput — TODO: brief description of this type.
 */
/**
 * CreateInvoiceInput — TODO: brief description of this type.
 */
/**
 * CreateInvoiceInput — TODO: brief description of this type.
 */
export interface CreateInvoiceInput {
    bookingId: string
    description: string
    unitPrice: number
    quantity?: number
    tenantId?: string
}

/**
 * EnsureInvoiceResult — TODO: brief description of this type.
 */
/**
 * EnsureInvoiceResult — TODO: brief description of this type.
 */
/**
 * EnsureInvoiceResult — TODO: brief description of this type.
 */
export interface EnsureInvoiceResult {
    invoiceId: string
    created: boolean
}

/**
 * CreateCheckoutSessionInput — TODO: brief description of this type.
 */
/**
 * CreateCheckoutSessionInput — TODO: brief description of this type.
 */
/**
 * CreateCheckoutSessionInput — TODO: brief description of this type.
 */
export interface CreateCheckoutSessionInput {
    invoiceId: string
}

/**
 * ProcessPaymentInput — TODO: brief description of this type.
 */
/**
 * ProcessPaymentInput — TODO: brief description of this type.
 */
/**
 * ProcessPaymentInput — TODO: brief description of this type.
 */
export interface ProcessPaymentInput {
    invoiceId: string
}

/**
 * ApplyCreditInput — TODO: brief description of this type.
 */
/**
 * ApplyCreditInput — TODO: brief description of this type.
 */
/**
 * ApplyCreditInput — TODO: brief description of this type.
 */
export interface ApplyCreditInput {
    invoiceId: string
    amount: number
    notes?: string
}

/**
 * VoidInvoiceInput — TODO: brief description of this type.
 */
/**
 * VoidInvoiceInput — TODO: brief description of this type.
 */
/**
 * VoidInvoiceInput — TODO: brief description of this type.
 */
export interface VoidInvoiceInput {
    invoiceId: string
    notes?: string
}

/**
 * RefundInvoiceInput — TODO: brief description of this type.
 */
/**
 * RefundInvoiceInput — TODO: brief description of this type.
 */
/**
 * RefundInvoiceInput — TODO: brief description of this type.
 */
export interface RefundInvoiceInput {
    invoiceId: string
    amount?: number
    notes?: string
}

/**
 * InvoiceFilterFormValues — TODO: brief description of this type.
 */
/**
 * InvoiceFilterFormValues — TODO: brief description of this type.
 */
/**
 * InvoiceFilterFormValues — TODO: brief description of this type.
 */
export interface InvoiceFilterFormValues {
    query: string
    invoiceId: string
    sortBy: 'createdAt' | 'name' | 'price'
}
