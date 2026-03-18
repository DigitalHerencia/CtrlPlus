'use server'

import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { assertSlotHasCapacity } from '@/lib/scheduling/capacity'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

const updateBookingSchema = z
    .object({
        startTime: z.date(),
        endTime: z.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })

type UpdateBookingInput = z.infer<typeof updateBookingSchema>

type BookingActionDTO = {
    id: string
    customerId: string
    wrapId: string
    startTime: Date
    endTime: Date
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    totalPrice: number
    createdAt: Date
    updatedAt: Date
}

export async function updateBooking(
    bookingId: string,
    input: UpdateBookingInput
): Promise<BookingActionDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = updateBookingSchema.parse(input)
    const { startTime, endTime } = parsed

    const existing = await prisma.booking.findFirst({
        where: { id: bookingId, deletedAt: null },
        select: {
            id: true,
            customerId: true,
            startTime: true,
            endTime: true,
            status: true,
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const booking = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
            await assertSlotHasCapacity(tx, {
                startTime,
                endTime,
                excludeBookingId: bookingId,
            })

            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { startTime, endTime },
            })

            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'UPDATE_BOOKING',
                    resourceType: 'Booking',
                    resourceId: updatedBooking.id,
                    details: JSON.stringify({
                        previousStartTime: existing.startTime.toISOString(),
                        previousEndTime: existing.endTime.toISOString(),
                        newStartTime: startTime.toISOString(),
                        newEndTime: endTime.toISOString(),
                    }),
                    timestamp: new Date(),
                },
            })

            return updatedBooking
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )

    return {
        id: booking.id,
        customerId: booking.customerId,
        wrapId: booking.wrapId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status as BookingActionDTO['status'],
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }
}
