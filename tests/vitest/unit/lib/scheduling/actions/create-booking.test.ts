import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    prisma: {
        $transaction: vi.fn(),
    },
    ensureInvoiceForBooking: vi.fn(),
    revalidateSchedulingPages: vi.fn(),
    revalidateBillingBookingRoute: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/actions/billing.actions', () => ({
    ensureInvoiceForBooking: mocks.ensureInvoiceForBooking,
}))

vi.mock('@/lib/cache/revalidate-tags', () => ({
    revalidateSchedulingPages: mocks.revalidateSchedulingPages,
    revalidateBillingBookingRoute: mocks.revalidateBillingBookingRoute,
}))

import { createBooking } from '@/lib/actions/scheduling.actions'

describe('createBooking', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('preserves the reservation handoff to billing and revalidates the affected routes', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })

        const tx = {
            wrap: { findFirst: vi.fn() },
            bookingReservation: { findFirst: vi.fn() },
            booking: { findFirst: vi.fn(), create: vi.fn(), count: vi.fn() },
            auditLog: { create: vi.fn() },
            availabilityRule: { findMany: vi.fn() },
        }

        mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))

        tx.wrap.findFirst.mockResolvedValue({
            id: 'wrap-1',
            name: 'Midnight Matte',
            price: 100000,
            isHidden: false,
        })
        tx.booking.findFirst.mockResolvedValue(null)
        tx.bookingReservation.findFirst.mockResolvedValue(null)
        tx.availabilityRule.findMany.mockResolvedValue([
            {
                startTime: '16:00',
                endTime: '18:00',
                capacitySlots: 2,
            },
        ])
        tx.booking.create.mockResolvedValue({
            id: 'booking-1',
            wrapId: 'wrap-1',
            startTime: new Date('2026-03-23T16:00:00.000Z'),
            endTime: new Date('2026-03-23T18:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
        })
        tx.auditLog.create.mockResolvedValue(undefined)

        mocks.ensureInvoiceForBooking.mockResolvedValue({ invoiceId: 'invoice-1' })

        await expect(
            createBooking({
                wrapId: 'wrap-1',
                startTime: new Date('2026-03-23T16:00:00.000Z').toISOString(),
                endTime: new Date('2026-03-23T18:00:00.000Z').toISOString(),
            })
        ).resolves.toEqual(
            expect.objectContaining({
                id: 'booking-1',
                invoiceId: 'invoice-1',
                wrapName: 'Midnight Matte',
                reservationExpiresAt: expect.any(String),
            })
        )

        expect(mocks.ensureInvoiceForBooking).toHaveBeenCalledWith({ bookingId: 'booking-1' })
        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
        expect(mocks.revalidateBillingBookingRoute).toHaveBeenCalledWith('invoice-1')
    })
})
