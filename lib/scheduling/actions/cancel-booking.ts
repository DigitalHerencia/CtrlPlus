'use server'

import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { BookingStatus, type BookingDTO } from '@/lib/scheduling/types'

export async function cancelBooking(bookingId: string): Promise<BookingDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const existing = await prisma.booking.findFirst({
        where: { id: bookingId, deletedAt: null },
        select: { id: true, customerId: true, status: true },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const booking = await prisma.$transaction(async (tx) => {
        await tx.bookingReservation.deleteMany({ where: { bookingId } })

        const updated = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: BookingStatus.CANCELLED,
            },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CANCEL_BOOKING',
                resourceType: 'Booking',
                resourceId: updated.id,
                details: JSON.stringify({ previousStatus: existing.status }),
                timestamp: new Date(),
            },
        })

        return updated
    })

    return {
        id: booking.id,
        customerId: booking.customerId,
        wrapId: booking.wrapId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status as BookingDTO['status'],
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }
}
