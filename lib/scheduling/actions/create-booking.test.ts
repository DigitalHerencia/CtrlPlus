import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    reserveSlot: vi.fn(),
    ensureInvoiceForBooking: vi.fn(),
    revalidateSchedulingPages: vi.fn(),
    revalidateBillingBookingRoute: vi.fn(),
}))

vi.mock('./reserve-slot', () => ({
    reserveSlot: mocks.reserveSlot,
}))

vi.mock('@/lib/billing/actions/ensure-invoice-for-booking', () => ({
    ensureInvoiceForBooking: mocks.ensureInvoiceForBooking,
}))

vi.mock('../revalidation', () => ({
    revalidateSchedulingPages: mocks.revalidateSchedulingPages,
    revalidateBillingBookingRoute: mocks.revalidateBillingBookingRoute,
}))

import { createBooking } from './create-booking'

describe('createBooking', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('preserves the reservation handoff to billing and revalidates the affected routes', async () => {
        mocks.reserveSlot.mockResolvedValue({
            id: 'booking-1',
            wrapId: 'wrap-1',
            wrapName: 'Midnight Matte',
            startTime: new Date('2026-03-23T16:00:00.000Z'),
            endTime: new Date('2026-03-23T18:00:00.000Z'),
            status: 'pending',
            totalPrice: 100000,
            reservationExpiresAt: new Date('2026-03-23T16:15:00.000Z'),
            displayStatus: 'reserved',
        })
        mocks.ensureInvoiceForBooking.mockResolvedValue({
            invoiceId: 'invoice-1',
        })

        await expect(
            createBooking({
                wrapId: 'wrap-1',
                startTime: new Date('2026-03-23T16:00:00.000Z'),
                endTime: new Date('2026-03-23T18:00:00.000Z'),
            })
        ).resolves.toEqual(
            expect.objectContaining({
                id: 'booking-1',
                invoiceId: 'invoice-1',
            })
        )

        expect(mocks.reserveSlot).toHaveBeenCalledTimes(1)
        expect(mocks.ensureInvoiceForBooking).toHaveBeenCalledWith({ bookingId: 'booking-1' })
        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
        expect(mocks.revalidateBillingBookingRoute).toHaveBeenCalledWith('invoice-1')
    })
})
