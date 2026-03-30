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
    bookingId: string
    status: InvoiceStatus
    totalAmount: number
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface InvoiceDetailDTO extends InvoiceDTO {
    lineItems: InvoiceLineItemDTO[]
    payments: PaymentDTO[]
}

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

export interface EnsureInvoiceForBookingInput {
    bookingId: string
}

export interface EnsureInvoiceResult {
    invoiceId: string
    created: boolean
}

export interface CreateCheckoutSessionInput {
    invoiceId: string
}
