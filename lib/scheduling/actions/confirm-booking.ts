'use server'

import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { revalidateSchedulingPages } from '../revalidation'

export interface ConfirmedBookingDTO {
    id: string
    customerId: string
    wrapId: string
    wrapName?: string
    startTime: Date
    endTime: Date
    status: 'confirmed'
    totalPrice: number
    reservationExpiresAt: null
    displayStatus: 'confirmed'
    createdAt: Date
    updatedAt: Date
}

export async function confirmBooking(bookingId: string): Promise<ConfirmedBookingDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const result = await prisma.$transaction(async (tx) => {
        const now = new Date()

        const booking = await tx.booking.findFirst({
            where: {
                id: bookingId,
                deletedAt: null,
            },
            select: {
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
                createdAt: true,
                updatedAt: true,
                reservation: {
                    select: {
                        id: true,
                        expiresAt: true,
                    },
                },
            },
        })

        if (!booking) {
            throw new Error('Forbidden: resource not found')
        }

        requireCustomerOwnedResourceAccess(session.authz, booking.customerId)

        if (booking.status !== 'pending') {
            throw new Error('Only pending bookings can be confirmed')
        }

        if (!booking.reservation || booking.reservation.expiresAt <= now) {
            throw new Error('Reservation has expired; please reserve again')
        }

        const confirmed = await tx.booking.update({
            where: { id: booking.id },
            data: {
                status: 'confirmed',
                reservation: {
                    delete: true,
                },
            },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CONFIRM_BOOKING',
                resourceType: 'Booking',
                resourceId: confirmed.id,
                details: JSON.stringify({
                    previousStatus: booking.status,
                    confirmedAt: now.toISOString(),
                }),
                timestamp: now,
            },
        })

        return {
            id: confirmed.id,
            customerId: confirmed.customerId,
            wrapId: confirmed.wrapId,
            wrapName: booking.wrap.name,
            startTime: confirmed.startTime,
            endTime: confirmed.endTime,
            status: 'confirmed' as const,
            totalPrice: confirmed.totalPrice,
            reservationExpiresAt: null,
            displayStatus: 'confirmed' as const,
            createdAt: confirmed.createdAt,
            updatedAt: confirmed.updatedAt,
        }
    })

    revalidateSchedulingPages()

    return result
}
