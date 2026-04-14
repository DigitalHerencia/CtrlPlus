import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getBookings: vi.fn(),
    getTenantLocationView: vi.fn(),
    cancelBooking: vi.fn(),
    redirect: vi.fn(),
}))

vi.mock('@/lib/fetchers/scheduling.fetchers', () => ({
    getBookings: mocks.getBookings,
}))

vi.mock('@/lib/fetchers/settings.fetchers', () => ({
    getTenantLocationView: mocks.getTenantLocationView,
}))

vi.mock('@/lib/actions/scheduling.actions', () => ({
    cancelBooking: mocks.cancelBooking,
}))

vi.mock('next/navigation', () => ({
    redirect: mocks.redirect,
}))

describe('SchedulingBookingsPageFeature', () => {
    it('renders a user-scoped appointments list with location and actions', async () => {
        mocks.getBookings.mockResolvedValue({
            items: [
                {
                    id: 'booking-1',
                    wrapId: 'wrap-1',
                    wrapName: 'Midnight Matte',
                    startTime: '2030-03-23T16:00:00.000Z',
                    endTime: '2030-03-23T18:00:00.000Z',
                    status: 'requested',
                    totalPrice: 100000,
                    reservationExpiresAt: null,
                    displayStatus: 'requested',
                    createdAt: '2026-03-20T10:00:00.000Z',
                    updatedAt: '2026-03-20T10:00:00.000Z',
                },
            ],
            total: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1,
        })
        mocks.getTenantLocationView.mockResolvedValue({
            tenantId: 'default-tenant',
            businessName: 'CtrlPlus Wrap Studio',
            address: '123 Main St, Denver, CO 80202',
        })

        const { SchedulingBookingsPageFeature } = await import(
            '@/features/scheduling/scheduling-bookings-page-feature'
        )

        render(await SchedulingBookingsPageFeature({ tab: 'upcoming' }))

        expect(screen.getByRole('heading', { name: /My Appointments/i })).toBeVisible()
        expect(screen.queryByText(/Manage Bookings/i)).not.toBeInTheDocument()
        expect(screen.getByText(/Wrap installation/i)).toBeVisible()
        expect(
            screen.getByText(/CtrlPlus Wrap Studio • 123 Main St, Denver, CO 80202/i)
        ).toBeVisible()
        expect(screen.getByRole('link', { name: /^View$/i })).toHaveAttribute(
            'href',
            '/scheduling/booking-1'
        )
        expect(screen.getByRole('link', { name: /Reschedule/i })).toHaveAttribute(
            'href',
            '/scheduling/booking-1/edit'
        )
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible()
    })

    it('uses the location fallback and removes reschedule and cancel for completed bookings', async () => {
        mocks.getBookings.mockResolvedValue({
            items: [
                {
                    id: 'booking-2',
                    wrapId: 'wrap-2',
                    wrapName: 'Signal Red',
                    startTime: '2030-03-24T16:00:00.000Z',
                    endTime: '2030-03-24T18:00:00.000Z',
                    status: 'completed',
                    totalPrice: 120000,
                    reservationExpiresAt: null,
                    displayStatus: 'completed',
                    createdAt: '2026-03-20T10:00:00.000Z',
                    updatedAt: '2026-03-20T10:00:00.000Z',
                },
            ],
            total: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1,
        })
        mocks.getTenantLocationView.mockResolvedValue({
            tenantId: 'default-tenant',
            businessName: null,
            address: null,
        })

        const { SchedulingBookingsPageFeature } = await import(
            '@/features/scheduling/scheduling-bookings-page-feature'
        )

        render(await SchedulingBookingsPageFeature({ tab: 'upcoming' }))

        expect(screen.getByText(/Location shared after confirmation/i)).toBeVisible()
        expect(screen.getByRole('link', { name: /^View$/i })).toBeVisible()
        expect(screen.queryByRole('link', { name: /Reschedule/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument()
    })

    it('routes inline customer cancellation through cancelBooking and redirects back to the same tab', async () => {
        const { createCustomerCancelBookingAction } = await import(
            '@/features/scheduling/scheduling-bookings-page-feature'
        )

        const action = createCustomerCancelBookingAction('upcoming')
        const formData = new FormData()
        formData.set('bookingId', 'booking-1')

        await action(formData)

        expect(mocks.cancelBooking).toHaveBeenCalledWith('booking-1', {
            reason: 'Cancelled by customer from My Appointments',
        })
        expect(mocks.redirect).toHaveBeenCalledWith('/scheduling/bookings?tab=upcoming')
    })
})
