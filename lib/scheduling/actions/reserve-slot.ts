'use server'

import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { reserveSlotSchema } from '@/schema/scheduling'
import { assertSlotHasCapacity } from '@/lib/scheduling/capacity'
import { type ReserveSlotInput, type ReservedBookingDTO } from '@/types/scheduling'
import { Prisma } from '@prisma/client'

const RESERVATION_TTL_MINUTES = 15

export async function reserveSlot(input: ReserveSlotInput): Promise<ReservedBookingDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = reserveSlotSchema.parse(input)

    return prisma.$transaction(
        async (tx) => {
            const now = new Date()
            const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60 * 1000)

            const wrap = await tx.wrap.findFirst({
                where: {
                    id: parsed.wrapId,
                    deletedAt: null,
                    ...(!session.isOwner && !session.isPlatformAdmin ? { isHidden: false } : {}),
                },
                select: { id: true, price: true, isHidden: true },
            })

            if (!wrap) {
                throw new Error('Wrap not found')
            }

            await assertSlotHasCapacity(tx, {
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                now,
            })

            const existingReservation = await tx.bookingReservation.findFirst({
                where: {
                    expiresAt: { gt: now },
                    booking: {
                        customerId: userId,
                        status: 'pending',
                        deletedAt: null,
                    },
                },
                select: { id: true },
            })

            if (existingReservation) {
                throw new Error('You already have an active reservation')
            }

            const booking = await tx.booking.create({
                data: {
                    customerId: userId,
                    wrapId: parsed.wrapId,
                    startTime: parsed.startTime,
                    endTime: parsed.endTime,
                    status: 'pending',
                    totalPrice: wrap.price,
                    reservation: {
                        create: {
                            expiresAt,
                        },
                    },
                },
                select: {
                    id: true,
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
                },
            })

            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'RESERVE_SLOT',
                    resourceType: 'Booking',
                    resourceId: booking.id,
                    details: JSON.stringify({
                        wrapId: booking.wrapId,
                        startTime: booking.startTime.toISOString(),
                        endTime: booking.endTime.toISOString(),
                        reservationExpiresAt: booking.reservation?.expiresAt.toISOString(),
                    }),
                    timestamp: now,
                },
            })

            return {
                id: booking.id,
                wrapId: booking.wrapId,
                wrapName: booking.wrap.name,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.status,
                totalPrice: booking.totalPrice,
                reservationExpiresAt: booking.reservation?.expiresAt ?? expiresAt,
                displayStatus: 'reserved',
            }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
}

export { RESERVATION_TTL_MINUTES }
