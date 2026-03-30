export const invoiceDTOFields = {
    id: true,
    bookingId: true,
    status: true,
    totalAmount: true,
    createdAt: true,
    updatedAt: true,
} as const

export const paymentDTOFields = {
    id: true,
    invoiceId: true,
    stripePaymentIntentId: true,
    status: true,
    amount: true,
    createdAt: true,
} as const

export const invoiceLineItemDTOFields = {
    id: true,
    description: true,
    quantity: true,
    unitPrice: true,
    totalPrice: true,
} as const
