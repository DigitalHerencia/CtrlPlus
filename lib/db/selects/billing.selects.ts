/**
 * @introduction Db — TODO: short one-line summary of billing.selects.ts
 *
 * @description TODO: longer description for billing.selects.ts. Keep it short — one or two sentences.
 * Domain: db
 * Public: TODO (yes/no)
 */
/**
 * invoiceDTOFields — TODO: brief description.
 */
export const invoiceDTOFields = {
    id: true,
    bookingId: true,
    status: true,
    subtotalAmount: true,
    taxAmount: true,
    totalAmount: true,
    dueDate: true,
    issuedAt: true,
    stripeCheckoutSessionId: true,
    stripeCustomerId: true,
    createdAt: true,
    updatedAt: true,
} as const

/**
 * paymentDTOFields — TODO: brief description.
 */
export const paymentDTOFields = {
    id: true,
    invoiceId: true,
    stripePaymentIntentId: true,
    status: true,
    amount: true,
    createdAt: true,
} as const

/**
 * invoiceLineItemDTOFields — TODO: brief description.
 */
export const invoiceLineItemDTOFields = {
    id: true,
    description: true,
    quantity: true,
    unitPrice: true,
    totalPrice: true,
} as const
