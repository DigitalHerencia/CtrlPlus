import { prisma } from '@/lib/prisma'
import { revalidateSchedulingPages } from '../revalidation'

export interface CleanupExpiredReservationsInput {
    now?: Date
    limit?: number
}

export interface CleanupExpiredReservationsResult {
    processedReservationIds: string[]
    processedBookingIds: string[]
}

export async function cleanupExpiredReservations(
    input: CleanupExpiredReservationsInput = {}
): Promise<CleanupExpiredReservationsResult> {
    const now = input.now ?? new Date()
    const limit = input.limit ?? 100

    const expired = await prisma.bookingReservation.findMany({
        where: {
            expiresAt: { lte: now },
            booking: {
                deletedAt: null,
                status: 'pending',
            },
        },
        select: {
            id: true,
            bookingId: true,
            booking: {
                select: {
                    customerId: true,
                },
            },
        },
        take: limit,
        orderBy: { expiresAt: 'asc' },
    })

    if (expired.length === 0) {
        return { processedReservationIds: [], processedBookingIds: [] }
    }

    const bookingIds = expired.map((item) => item.bookingId)
    const reservationIds = expired.map((item) => item.id)

    await prisma.$transaction(async (tx) => {
        await tx.booking.updateMany({
            where: {
                id: { in: bookingIds },
                status: 'pending',
                deletedAt: null,
            },
            data: {
                status: 'cancelled',
                deletedAt: now,
            },
        })

        await tx.bookingReservation.deleteMany({
            where: {
                id: { in: reservationIds },
            },
        })

        await tx.auditLog.createMany({
            data: expired.map((record) => ({
                userId: record.booking.customerId,
                action: 'EXPIRE_BOOKING_RESERVATION',
                resourceType: 'Booking',
                resourceId: record.bookingId,
                details: JSON.stringify({ reservationId: record.id, expiredAt: now.toISOString() }),
                timestamp: now,
            })),
        })
    })

    revalidateSchedulingPages()

    return {
        processedReservationIds: reservationIds,
        processedBookingIds: bookingIds,
    }
}
