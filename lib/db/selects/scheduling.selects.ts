/**
 * @introduction Db — TODO: short one-line summary of scheduling.selects.ts
 *
 * @description TODO: longer description for scheduling.selects.ts. Keep it short — one or two sentences.
 * Domain: db
 * Public: TODO (yes/no)
 */
/**
 * availabilitySelectFields — TODO: brief description.
 */
export const availabilitySelectFields = {
    id: true,
    dayOfWeek: true,
    startTime: true,
    endTime: true,
    capacitySlots: true,
    createdAt: true,
    updatedAt: true,
} as const

/**
 * bookingSelectFields — TODO: brief description.
 */
export const bookingSelectFields = {
    id: true,
    customerId: true,
    wrapId: true,
    wrap: {
        select: {
            name: true,
        },
    },
    startTime: true,
    endTime: true,
    status: true,
    totalPrice: true,
    wrapNameSnapshot: true,
    wrapPriceSnapshot: true,
    customerName: true,
    customerEmail: true,
    customerPhone: true,
    preferredContact: true,
    billingAddressLine1: true,
    billingAddressLine2: true,
    billingCity: true,
    billingState: true,
    billingPostalCode: true,
    billingCountry: true,
    vehicleMake: true,
    vehicleModel: true,
    vehicleYear: true,
    vehicleTrim: true,
    previewImageUrl: true,
    previewPromptUsed: true,
    notes: true,
    reservation: {
        select: {
            expiresAt: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const

/**
 * bookingDraftSelectFields — TODO: brief description.
 */
export const bookingDraftSelectFields = {
    id: true,
    customerId: true,
    wrapId: true,
    wrapNameSnapshot: true,
    wrapPriceSnapshot: true,
    vehicleMake: true,
    vehicleModel: true,
    vehicleYear: true,
    vehicleTrim: true,
    previewImageUrl: true,
    previewPromptUsed: true,
    previewStatus: true,
    createdAt: true,
    updatedAt: true,
} as const
