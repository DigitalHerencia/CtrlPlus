import type { InvoiceStatus, PaymentStatus } from '@/lib/constants/statuses'
import type { Timestamp } from './common.types'

export interface InvoiceLineItemDTO {
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
}

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

export interface InvoicePaymentEventDTO {
    id: string
    type: 'payment' | 'refund' | 'credit' | 'void'
    amount: number
    createdAt: Timestamp
    providerReference: string | null
    notes: string | null
}

export interface InvoiceDetailViewDTO extends InvoiceDTO {
    lineItems: InvoiceLineItemDTO[]
    paymentHistory: InvoicePaymentEventDTO[]
}

export interface InvoiceDetailDTO extends InvoiceDetailViewDTO {
    // Backwards-compatible alias for existing components/tests.
    payments: PaymentDTO[]
}

export type InvoiceManagerRowDTO = InvoiceDTO

export interface PaymentDTO {
    id: string
    invoiceId: string
    stripePaymentIntentId: string
    status: PaymentStatus
    amount: number
    createdAt: Timestamp
}

export interface InvoiceListParams {
    page: number
    pageSize: number
    status?: InvoiceStatus
    query?: string
}

export interface InvoiceListResult {
    invoices: InvoiceDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CheckoutSessionDTO {
    sessionId: string
    url: string
    invoiceId: string
}

export interface ConfirmPaymentResult {
    invoiceId: string
    paymentId: string
    status: 'pending' | 'succeeded' | 'failed'
}

export interface BillingBalanceDTO {
    outstandingAmount: number
    creditAmount: number
    currency: string
}

export interface EnsureInvoiceForBookingInput {
    bookingId: string
}

export interface CreateInvoiceInput {
    bookingId: string
    tenantId?: string
}

export interface EnsureInvoiceResult {
    invoiceId: string
    created: boolean
}

export interface CreateCheckoutSessionInput {
    invoiceId: string
}

export interface ProcessPaymentInput {
    invoiceId: string
}

export interface ApplyCreditInput {
    invoiceId: string
    amount: number
    notes?: string
}

export interface VoidInvoiceInput {
    invoiceId: string
    notes?: string
}

export interface RefundInvoiceInput {
    invoiceId: string
    amount?: number
    notes?: string
}
