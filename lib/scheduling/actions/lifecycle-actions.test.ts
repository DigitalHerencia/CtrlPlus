import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCustomerOwnedResourceAccess: vi.fn(),
    assertSlotHasCapacity: vi.fn(),
    revalidateSchedulingPages: vi.fn(),
    prisma: {
        $transaction: vi.fn(),
        booking: {
            findFirst: vi.fn(),
            update: vi.fn(),
            updateMany: vi.fn(),
            count: vi.fn(),
        },
        bookingReservation: {
            deleteMany: vi.fn(),
            findMany: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
            createMany: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCustomerOwnedResourceAccess: mocks.requireCustomerOwnedResourceAccess,
}))

vi.mock('@/lib/scheduling/capacity', () => ({
    assertSlotHasCapacity: mocks.assertSlotHasCapacity,
}))

vi.mock('@/lib/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('../revalidation', () => ({
    revalidateSchedulingPages: mocks.revalidateSchedulingPages,
    revalidateBillingBookingRoute: vi.fn(),
}))

import { cancelBooking } from './cancel-booking'
import { cleanupExpiredReservations } from './cleanup-expired-reservations'
import { confirmBooking } from './confirm-booking'
import { updateBooking } from './update-booking'

function createTx() {
    return {
        booking: {
            findFirst: vi.fn(),
            update: vi.fn(),
            updateMany: vi.fn(),
        },
        bookingReservation: {
            deleteMany: vi.fn(),
            findMany: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
            createMany: vi.fn(),
        },
    }
}

describe('scheduling lifecycle actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })
        mocks.requireCustomerOwnedResourceAccess.mockImplementation(() => undefined)
    })

    it('rejects confirmation after a reservation expires', async () => {
        const tx = createTx()
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { name: 'Midnight Matte' },
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
            reservation: {
                id: 'reservation-1',
                expiresAt: new Date('2020-03-20T09:00:00.000Z'),
            },
        })

        await expect(confirmBooking('booking-1')).rejects.toThrow(
            'Reservation has expired; please reserve again'
        )
        expect(tx.booking.update).not.toHaveBeenCalled()
    })

    it('confirms a live reservation and revalidates scheduling routes', async () => {
        const tx = createTx()
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { name: 'Midnight Matte' },
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
            reservation: {
                id: 'reservation-1',
                expiresAt: new Date('2030-03-23T17:00:00.000Z'),
            },
        })
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'confirmed',
            totalPrice: 100000,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })

        await expect(confirmBooking('booking-1')).resolves.toEqual(
            expect.objectContaining({
                id: 'booking-1',
                wrapName: 'Midnight Matte',
                status: 'confirmed',
                displayStatus: 'confirmed',
            })
        )
        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
    })

    it('cancels a booking, removes the reservation hold, and revalidates scheduling routes', async () => {
        const tx = createTx()
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            status: 'pending',
            wrap: { name: 'Midnight Matte' },
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'cancelled',
            totalPrice: 100000,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })

        await expect(cancelBooking('booking-1')).resolves.toEqual(
            expect.objectContaining({
                wrapName: 'Midnight Matte',
                status: 'cancelled',
                displayStatus: 'cancelled',
                reservationExpiresAt: null,
            })
        )
        expect(tx.bookingReservation.deleteMany).toHaveBeenCalledWith({
            where: { bookingId: 'booking-1' },
        })
        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
    })

    it('updates a booking without moving lifecycle decisions into the client', async () => {
        const tx = createTx()
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'pending',
            wrap: { name: 'Midnight Matte' },
            reservation: { expiresAt: new Date('2030-03-23T17:00:00.000Z') },
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        mocks.assertSlotHasCapacity.mockResolvedValue(undefined)
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            startTime: new Date('2030-03-23T17:00:00.000Z'),
            endTime: new Date('2030-03-23T19:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })

        await expect(
            updateBooking('booking-1', {
                startTime: new Date('2030-03-23T17:00:00.000Z'),
                endTime: new Date('2030-03-23T19:00:00.000Z'),
            })
        ).resolves.toEqual(
            expect.objectContaining({
                wrapName: 'Midnight Matte',
                displayStatus: 'reserved',
                reservationExpiresAt: new Date('2030-03-23T17:00:00.000Z'),
            })
        )
        expect(mocks.assertSlotHasCapacity).toHaveBeenCalledWith(
            tx,
            expect.objectContaining({
                excludeBookingId: 'booking-1',
            })
        )
    })

    it('cleans up expired reservations idempotently', async () => {
        const tx = createTx()
        mocks.prisma.bookingReservation.findMany
            .mockResolvedValueOnce([
                {
                    id: 'reservation-1',
                    bookingId: 'booking-1',
                    booking: {
                        customerId: 'user-1',
                    },
                },
            ])
            .mockResolvedValueOnce([])
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))

        tx.booking.updateMany.mockResolvedValue({ count: 1 })
        tx.bookingReservation.deleteMany.mockResolvedValue({ count: 1 })
        tx.auditLog.createMany.mockResolvedValue({ count: 1 })

        await expect(cleanupExpiredReservations({ now: new Date('2026-03-23T18:00:00.000Z') })).resolves.toEqual(
            {
                processedReservationIds: ['reservation-1'],
                processedBookingIds: ['booking-1'],
            }
        )

        await expect(cleanupExpiredReservations({ now: new Date('2026-03-23T18:00:00.000Z') })).resolves.toEqual(
            {
                processedReservationIds: [],
                processedBookingIds: [],
            }
        )

        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
    })
})
