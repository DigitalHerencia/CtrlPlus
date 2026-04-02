import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    assertSlotHasCapacity: vi.fn(),
    prisma: {
        $transaction: vi.fn(),
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/db/transactions/scheduling.transactions', () => ({
    assertSlotHasCapacity: mocks.assertSlotHasCapacity,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import { reserveSlot } from '@/lib/actions/scheduling.actions'

function createTx() {
    return {
        wrap: {
            findFirst: vi.fn(),
        },
        bookingReservation: {
            findFirst: vi.fn(),
        },
        booking: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
    }
}

describe('reserveSlot', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fails closed when the caller is not authenticated', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: false,
            userId: null,
            isOwner: false,
            isPlatformAdmin: false,
            authz: {},
        })

        await expect(
            reserveSlot({
                wrapId: 'wrap-1',
                startTime: new Date('2030-03-23T16:00:00.000Z').toISOString(),
                endTime: new Date('2030-03-23T18:00:00.000Z').toISOString(),
            })
        ).rejects.toThrow('Unauthorized: not authenticated')
    })

    it('rejects a second live reservation for the same customer', async () => {
        const tx = createTx()
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        tx.wrap.findFirst.mockResolvedValue({
            id: 'wrap-1',
            name: 'Midnight Matte',
            price: 100000,
            isHidden: false,
        })
        tx.booking.findFirst.mockResolvedValue(null)
        tx.bookingReservation.findFirst.mockResolvedValue({ id: 'reservation-1' })

        await expect(
            reserveSlot({
                wrapId: 'wrap-1',
                startTime: new Date('2030-03-23T16:00:00.000Z').toISOString(),
                endTime: new Date('2030-03-23T18:00:00.000Z').toISOString(),
            })
        ).rejects.toThrow('You already have an active reservation')
        expect(tx.booking.create).not.toHaveBeenCalled()
    })

    it('rejects when capacity enforcement fails', async () => {
        const tx = createTx()
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        mocks.assertSlotHasCapacity.mockRejectedValue(
            new Error('The requested time slot is fully booked - no remaining capacity')
        )
        tx.wrap.findFirst.mockResolvedValue({
            id: 'wrap-1',
            name: 'Midnight Matte',
            price: 100000,
            isHidden: false,
        })
        tx.booking.findFirst.mockResolvedValue(null)
        tx.bookingReservation.findFirst.mockResolvedValue(null)

        await expect(
            reserveSlot({
                wrapId: 'wrap-1',
                startTime: new Date('2030-03-23T16:00:00.000Z').toISOString(),
                endTime: new Date('2030-03-23T18:00:00.000Z').toISOString(),
            })
        ).rejects.toThrow('The requested time slot is fully booked - no remaining capacity')
        expect(tx.booking.create).not.toHaveBeenCalled()
    })

    it('creates a reserved booking with a hold expiration and derived display status', async () => {
        const tx = createTx()
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })
        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))
        mocks.assertSlotHasCapacity.mockResolvedValue(undefined)
        tx.wrap.findFirst.mockResolvedValue({
            id: 'wrap-1',
            name: 'Midnight Matte',
            price: 100000,
            isHidden: false,
        })
        tx.booking.findFirst.mockResolvedValue(null)
        tx.bookingReservation.findFirst.mockResolvedValue(null)
        tx.booking.create.mockResolvedValue({
            id: 'booking-1',
            wrapId: 'wrap-1',
            startTime: new Date('2026-03-23T16:00:00.000Z'),
            endTime: new Date('2026-03-23T18:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
        })
        tx.auditLog.create.mockResolvedValue(undefined)

        await expect(
            reserveSlot({
                wrapId: 'wrap-1',
                startTime: new Date('2030-03-23T16:00:00.000Z').toISOString(),
                endTime: new Date('2030-03-23T18:00:00.000Z').toISOString(),
            })
        ).resolves.toEqual(
            expect.objectContaining({
                id: 'booking-1',
                wrapName: 'Midnight Matte',
                reservationExpiresAt: expect.any(String),
                displayStatus: 'reserved',
            })
        )
    })
})
