export const availabilitySelectFields = {
    id: true,
    dayOfWeek: true,
    startTime: true,
    endTime: true,
    capacitySlots: true,
    createdAt: true,
    updatedAt: true,
} as const

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
    reservation: {
        select: {
            expiresAt: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const
