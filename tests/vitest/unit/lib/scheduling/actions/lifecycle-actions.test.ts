import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireOwnerOrPlatformAdmin: vi.fn(),
    requireCustomerOwnedResourceAccess: vi.fn(),
    assertSlotHasCapacity: vi.fn(),
    revalidateSchedulingPages: vi.fn(),
    getTenantNotificationEmail: vi.fn(),
    sendNotificationEmail: vi.fn(),
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

vi.mock('@/lib/authz/guards', () => ({
    requireOwnerOrPlatformAdmin: mocks.requireOwnerOrPlatformAdmin,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCustomerOwnedResourceAccess: mocks.requireCustomerOwnedResourceAccess,
}))

vi.mock('@/lib/db/transactions/scheduling.transactions', () => ({
    assertSlotHasCapacity: mocks.assertSlotHasCapacity,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/cache/revalidate-tags', () => ({
    revalidateSchedulingPages: mocks.revalidateSchedulingPages,
}))

vi.mock('@/lib/integrations/notifications', () => ({
    getTenantNotificationEmail: mocks.getTenantNotificationEmail,
    sendNotificationEmail: mocks.sendNotificationEmail,
}))

import {
    cancelBooking,
    cleanupExpiredReservations,
    confirmBooking,
    updateBooking,
} from '@/lib/actions/scheduling.actions'

function createTx() {
    return {
        booking: {
            findFirst: vi.fn(),
            update: vi.fn(),
            updateMany: vi.fn(),
            findMany: vi.fn(),
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
        mocks.getTenantNotificationEmail.mockResolvedValue('owner@example.com')
        mocks.sendNotificationEmail.mockResolvedValue({ delivered: true })
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })
        mocks.requireOwnerOrPlatformAdmin.mockResolvedValue({
            isAuthenticated: true,
            userId: 'owner-1',
            isOwner: true,
            isPlatformAdmin: false,
            authz: { role: 'owner' },
        })
        mocks.requireCustomerOwnedResourceAccess.mockImplementation(() => undefined)
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('confirms requested bookings from the owner surface and revalidates scheduling routes', async () => {
        const tx = createTx()
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { name: 'Midnight Matte' },
            wrapNameSnapshot: 'Midnight Matte',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'requested',
            totalPrice: 100000,
            customerEmail: 'customer@example.com',
            reservation: null,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
        })
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { name: 'Midnight Matte' },
            wrapNameSnapshot: 'Midnight Matte',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'confirmed',
            totalPrice: 100000,
            customerEmail: 'customer@example.com',
            reservation: null,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })
        tx.auditLog.create.mockResolvedValue(undefined)

        await expect(confirmBooking('booking-1')).resolves.toEqual(
            expect.objectContaining({
                id: 'booking-1',
                wrapName: 'Midnight Matte',
                status: 'confirmed',
                displayStatus: 'confirmed',
            })
        )

        expect(mocks.sendNotificationEmail).toHaveBeenCalledTimes(2)
        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
    })

    it('rejects confirming bookings that are not awaiting owner confirmation', async () => {
        const tx = createTx()
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { name: 'Midnight Matte' },
            wrapNameSnapshot: 'Midnight Matte',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'confirmed',
            totalPrice: 100000,
            customerEmail: 'customer@example.com',
            reservation: null,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
        })

        await expect(confirmBooking('booking-1')).rejects.toThrow(
            'Only requested bookings can be confirmed'
        )
        expect(tx.booking.update).not.toHaveBeenCalled()
    })

    it('cancels a booking, removes the reservation hold, and revalidates scheduling routes', async () => {
        const tx = createTx()
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            status: 'requested',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'cancelled',
            totalPrice: 100000,
            reservation: null,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })
        tx.auditLog.create.mockResolvedValue(undefined)

        await expect(
            cancelBooking('booking-1', { reason: 'Customer requested cancellation' })
        ).resolves.toEqual(
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

    it('updates a customer booking without changing owner-controlled status', async () => {
        const tx = createTx()
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'requested',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
            reservation: null,
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        mocks.assertSlotHasCapacity.mockResolvedValue(undefined)
        tx.booking.findFirst.mockResolvedValue(null)
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
            startTime: new Date('2030-03-23T17:00:00.000Z'),
            endTime: new Date('2030-03-23T19:00:00.000Z'),
            status: 'requested',
            totalPrice: 100000,
            reservation: null,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })
        tx.auditLog.create.mockResolvedValue(undefined)

        await expect(
            updateBooking('booking-1', {
                startTime: new Date('2030-03-23T17:00:00.000Z').toISOString(),
                endTime: new Date('2030-03-23T19:00:00.000Z').toISOString(),
            })
        ).resolves.toEqual(
            expect.objectContaining({
                wrapName: 'Midnight Matte',
                status: 'requested',
                displayStatus: 'expired',
            })
        )
        expect(mocks.assertSlotHasCapacity).toHaveBeenCalledWith(
            tx,
            expect.objectContaining({
                excludeBookingId: 'booking-1',
            })
        )
    })

    it('owner reschedules a booking and sends a customer notification', async () => {
        const tx = createTx()
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'owner-1',
            isOwner: true,
            isPlatformAdmin: false,
            authz: { role: 'owner' },
        })
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'confirmed',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
            customerEmail: 'customer@example.com',
            reservation: null,
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        mocks.assertSlotHasCapacity.mockResolvedValue(undefined)
        tx.booking.findFirst.mockResolvedValue(null)
        tx.booking.update.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
            startTime: new Date('2030-03-24T17:00:00.000Z'),
            endTime: new Date('2030-03-24T19:00:00.000Z'),
            status: 'reschedule_requested',
            totalPrice: 100000,
            customerEmail: 'customer@example.com',
            reservation: null,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-23T12:00:00.000Z'),
        })
        tx.auditLog.create.mockResolvedValue(undefined)

        await expect(
            updateBooking('booking-1', {
                startTime: new Date('2030-03-24T17:00:00.000Z').toISOString(),
                endTime: new Date('2030-03-24T19:00:00.000Z').toISOString(),
            })
        ).resolves.toEqual(
            expect.objectContaining({
                status: 'reschedule_requested',
                displayStatus: 'reschedule_requested',
            })
        )

        expect(mocks.sendNotificationEmail).toHaveBeenCalledTimes(2)
    })

    it('rejects cancelling completed bookings', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            status: 'completed',
            wrapNameSnapshot: 'Midnight Matte',
            wrap: { name: 'Midnight Matte' },
        })

        await expect(cancelBooking('booking-1', { reason: 'late request' })).rejects.toThrow(
            'Completed bookings cannot be cancelled'
        )

        expect(mocks.prisma.$transaction).not.toHaveBeenCalled()
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

        await expect(
            cleanupExpiredReservations({ now: new Date('2026-03-23T18:00:00.000Z') })
        ).resolves.toEqual({
            processedReservationIds: ['reservation-1'],
            processedBookingIds: ['booking-1'],
        })

        await expect(
            cleanupExpiredReservations({ now: new Date('2026-03-23T18:00:00.000Z') })
        ).resolves.toEqual({
            processedReservationIds: [],
            processedBookingIds: [],
        })

        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
    })
})
