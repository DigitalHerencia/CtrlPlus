import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    hasCapability: vi.fn(),
    prisma: {
        booking: {
            findMany: vi.fn(),
            count: vi.fn(),
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    hasCapability: mocks.hasCapability,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import {
    getBookingById,
    getBookings,
    getUpcomingBookingCount,
} from '@/lib/fetchers/scheduling.fetchers'

const sharedSession = {
    isAuthenticated: true,
    userId: 'user-1',
    authz: { role: 'customer' },
}

describe('scheduling booking fetchers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns only the current customer bookings when the user cannot read all bookings', async () => {
        mocks.getSession.mockResolvedValue(sharedSession)
        mocks.hasCapability.mockImplementation(
            (_, capability) => capability === 'scheduling.read.own'
        )
        mocks.prisma.booking.findMany.mockResolvedValue([
            {
                id: 'booking-1',
                customerId: 'user-1',
                wrapId: 'wrap-1',
                wrap: { name: 'Midnight Matte' },
                startTime: new Date('2030-03-23T16:00:00.000Z'),
                endTime: new Date('2030-03-23T18:00:00.000Z'),
                status: 'pending',
                totalPrice: 100000,
                reservation: { expiresAt: new Date('2030-03-23T15:30:00.000Z') },
                createdAt: new Date('2026-03-20T10:00:00.000Z'),
                updatedAt: new Date('2026-03-20T10:00:00.000Z'),
            },
            {
                id: 'booking-2',
                customerId: 'user-1',
                wrapId: 'wrap-2',
                wrap: { name: 'Signal Red' },
                startTime: new Date('2030-03-24T16:00:00.000Z'),
                endTime: new Date('2030-03-24T18:00:00.000Z'),
                status: 'pending',
                totalPrice: 120000,
                reservation: { expiresAt: new Date('2020-03-20T09:00:00.000Z') },
                createdAt: new Date('2026-03-20T11:00:00.000Z'),
                updatedAt: new Date('2026-03-20T11:00:00.000Z'),
            },
        ])
        mocks.prisma.booking.count.mockResolvedValue(2)

        const result = await getBookings({
            page: 1,
            pageSize: 20,
            fromDate: new Date('2026-03-01T00:00:00.000Z').toISOString(),
        })

        expect(mocks.prisma.booking.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    customerId: 'user-1',
                }),
            })
        )
        expect(result.items).toEqual([
            expect.objectContaining({
                id: 'booking-1',
                wrapName: 'Midnight Matte',
                reservationExpiresAt: new Date('2030-03-23T15:30:00.000Z').toISOString(),
                displayStatus: 'reserved',
            }),
            expect.objectContaining({
                id: 'booking-2',
                wrapName: 'Signal Red',
                reservationExpiresAt: new Date('2020-03-20T09:00:00.000Z').toISOString(),
                displayStatus: 'expired',
            }),
        ])
    })

    it('returns all bookings when the user can read all bookings', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'owner-1',
            authz: { role: 'owner' },
        })
        mocks.hasCapability.mockReturnValue(true)
        mocks.prisma.booking.findMany.mockResolvedValue([])
        mocks.prisma.booking.count.mockResolvedValue(0)

        await getBookings({ page: 1, pageSize: 10 })

        const call = mocks.prisma.booking.findMany.mock.calls[0]?.[0]
        expect(call.where.customerId).toBeUndefined()
    })

    it('returns a booking by id within the current access scope', async () => {
        mocks.getSession.mockResolvedValue(sharedSession)
        mocks.hasCapability.mockImplementation(
            (_, capability) => capability === 'scheduling.read.own'
        )
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { name: 'Midnight Matte' },
            startTime: new Date('2030-03-23T16:00:00.000Z'),
            endTime: new Date('2030-03-23T18:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
            reservation: { expiresAt: new Date('2030-03-23T17:00:00.000Z') },
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
        })

        await expect(getBookingById('booking-1')).resolves.toEqual(
            expect.objectContaining({
                id: 'booking-1',
                displayStatus: 'reserved',
            })
        )
    })

    it('counts upcoming bookings in the active scope', async () => {
        mocks.getSession.mockResolvedValue(sharedSession)
        mocks.hasCapability.mockImplementation(
            (_, capability) => capability === 'scheduling.read.own'
        )
        mocks.prisma.booking.count.mockResolvedValue(1)

        await expect(getUpcomingBookingCount(new Date('2026-03-01T00:00:00.000Z'))).resolves.toBe(1)

        expect(mocks.prisma.booking.count).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    customerId: 'user-1',
                }),
            })
        )
    })
})
