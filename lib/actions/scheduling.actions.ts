'use server'

import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import {
    cancelBookingSchema,
    reserveSlotSchema,
    updateBookingSchema,
} from '@/schemas/scheduling.schemas'
import { assertSlotHasCapacity } from '@/lib/db/transactions/scheduling.transactions'
import { ensureInvoiceForBooking } from '@/lib/actions/billing.actions'
import {
    revalidateBillingBookingRoute,
    revalidateSchedulingPages,
} from '@/lib/cache/revalidate-tags'
import type {
    ReserveSlotInput,
    ReservedBookingDTO,
    CreatedBookingDTO,
    UpdateBookingInput,
    CancelBookingInput,
    BookingActionDTO,
} from '@/types/scheduling.types'
import { getBookingDisplayStatus } from '@/lib/constants/statuses'
import { Prisma } from '@prisma/client'

// Reservation TTL (minutes)
const RESERVATION_TTL_MINUTES = 15

async function assertNoCustomerSlotConflict(
    tx: Prisma.TransactionClient,
    input: {
        customerId: string
        startTime: Date
        endTime: Date
        now: Date
        excludeBookingId?: string
    }
): Promise<void> {
    const existing = await tx.booking.findFirst({
        where: {
            deletedAt: null,
            customerId: input.customerId,
            id: input.excludeBookingId ? { not: input.excludeBookingId } : undefined,
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
            OR: [
                { status: 'confirmed' },
                { status: 'completed' },
                {
                    status: 'pending',
                    reservation: {
                        is: {
                            expiresAt: { gt: input.now },
                        },
                    },
                },
            ],
        },
        select: { id: true },
    })

    if (existing) {
        throw new Error('You already have a booking in this time slot')
    }
}

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
                select: { id: true, name: true, price: true, isHidden: true },
            })

            if (!wrap) {
                throw new Error('Wrap not found')
            }

            await assertSlotHasCapacity(tx, {
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                now,
            })

            await assertNoCustomerSlotConflict(tx, {
                customerId: userId,
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
                    startTime: true,
                    endTime: true,
                    status: true,
                    totalPrice: true,
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
                        status: booking.status,
                        startTime: booking.startTime.toISOString(),
                        endTime: booking.endTime.toISOString(),
                        reservationExpiresAt: expiresAt.toISOString(),
                    }),
                    timestamp: now,
                },
            })

            return {
                id: booking.id,
                wrapId: booking.wrapId,
                wrapName: wrap.name,
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                status: booking.status as ReservedBookingDTO['status'],
                totalPrice: booking.totalPrice,
                reservationExpiresAt: expiresAt.toISOString(),
                displayStatus: 'reserved',
            }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
}

export async function createBooking(input: ReserveSlotInput): Promise<CreatedBookingDTO> {
    const booking = await reserveSlot(input)
    const { invoiceId } = await ensureInvoiceForBooking({ bookingId: booking.id })
    revalidateSchedulingPages()
    revalidateBillingBookingRoute(invoiceId)

    return {
        invoiceId,
        ...booking,
        id: booking.id,
        wrapId: booking.wrapId,
        wrapName: booking.wrapName,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalPrice: booking.totalPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reservationExpiresAt: booking.reservationExpiresAt,
        displayStatus: booking.displayStatus,
    }
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
            wrap: {
                select: {
                    name: true,
                },
            },
            reservation: {
                select: {
                    expiresAt: true,
                },
            },
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const booking = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
            const now = new Date()

            await assertSlotHasCapacity(tx, {
                startTime,
                endTime,
                excludeBookingId: bookingId,
            })

            await assertNoCustomerSlotConflict(tx, {
                customerId: existing.customerId,
                startTime,
                endTime,
                now,
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

    revalidateSchedulingPages()

    return {
        id: booking.id,
        customerId: booking.customerId,
        wrapId: booking.wrapId,
        wrapName: existing.wrap.name,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status as BookingActionDTO['status'],
        totalPrice: booking.totalPrice,
        reservationExpiresAt: existing.reservation?.expiresAt
            ? existing.reservation.expiresAt.toISOString()
            : null,
        displayStatus: getBookingDisplayStatus(
            booking.status as BookingActionDTO['status'],
            existing.reservation?.expiresAt ?? null
        ),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
    }
}

export async function confirmBooking(bookingId: string) {
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

        const confirmedResult = {
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

        return confirmedResult
    })

    const { invoiceId } = await ensureInvoiceForBooking({ bookingId: result.id })

    revalidateSchedulingPages()
    revalidateBillingBookingRoute(invoiceId)

    return result
}

export async function cancelBooking(bookingId: string, input: CancelBookingInput) {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = cancelBookingSchema.parse(input)

    const existing = await prisma.booking.findFirst({
        where: { id: bookingId, deletedAt: null },
        select: {
            id: true,
            customerId: true,
            status: true,
            wrap: {
                select: {
                    name: true,
                },
            },
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    if (existing.status === 'completed') {
        throw new Error('Completed bookings cannot be cancelled')
    }

    if (existing.status === 'cancelled') {
        throw new Error('Booking is already cancelled')
    }

    const booking = await prisma.$transaction(async (tx) => {
        await tx.bookingReservation.deleteMany({ where: { bookingId } })

        const updated = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: 'cancelled',
            },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CANCEL_BOOKING',
                resourceType: 'Booking',
                resourceId: updated.id,
                details: JSON.stringify({
                    previousStatus: existing.status,
                    reason: parsed.reason,
                }),
                timestamp: new Date(),
            },
        })

        return updated
    })

    revalidateSchedulingPages()

    return {
        id: booking.id,
        customerId: booking.customerId,
        wrapId: booking.wrapId,
        wrapName: existing.wrap.name,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status,
        totalPrice: booking.totalPrice,
        reservationExpiresAt: null,
        displayStatus: 'cancelled',
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
    }
}

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
