export interface CreateInvoiceInput {
    tenantId: string
    bookingId: string
    customerId?: string
    amountCents: number
    currency?: string
    description?: string
}

export interface ConfirmAppointmentInput {
    tenantId: string
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
    note?: string
}
