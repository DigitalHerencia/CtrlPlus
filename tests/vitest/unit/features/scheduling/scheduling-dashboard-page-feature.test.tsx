import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getBookings: vi.fn(),
    getUpcomingBookingCount: vi.fn(),
    getTenantLocationView: vi.fn(),
}))

vi.mock('@/lib/fetchers/scheduling.fetchers', () => ({
    getBookings: mocks.getBookings,
    getUpcomingBookingCount: mocks.getUpcomingBookingCount,
}))

vi.mock('@/lib/fetchers/settings.fetchers', () => ({
    getTenantLocationView: mocks.getTenantLocationView,
}))

describe('SchedulingDashboardPageFeature', () => {
    it('keeps manager controls hidden from customer-scoped scheduling', async () => {
        mocks.getUpcomingBookingCount.mockResolvedValue(2)
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

        const { SchedulingDashboardPageFeature } = await import(
            '@/features/scheduling/scheduling-dashboard-page-feature'
        )

        render(
            await SchedulingDashboardPageFeature({
                userId: 'user-1',
                canManageAppointments: false,
            })
        )

        expect(screen.getByRole('heading', { name: /Appointment Scheduling/i })).toBeVisible()
        expect(screen.getByRole('link', { name: /Book Appointment/i })).toHaveAttribute(
            'href',
            '/scheduling/book'
        )
        expect(screen.queryByRole('link', { name: /Manage Appointments/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Admin Console/i })).not.toBeInTheDocument()
    })

    it('shows the scheduling manager entrypoint only when manager capability is provided', async () => {
        mocks.getUpcomingBookingCount.mockResolvedValue(0)
        mocks.getBookings.mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            pageSize: 20,
            totalPages: 0,
        })
        mocks.getTenantLocationView.mockResolvedValue({
            tenantId: 'default-tenant',
            businessName: null,
            address: null,
        })

        const { SchedulingDashboardPageFeature } = await import(
            '@/features/scheduling/scheduling-dashboard-page-feature'
        )

        render(
            await SchedulingDashboardPageFeature({
                userId: 'owner-1',
                canManageAppointments: true,
            })
        )

        expect(screen.getByRole('link', { name: /Manage Appointments/i })).toHaveAttribute(
            'href',
            '/scheduling/manage'
        )
        expect(screen.queryByRole('link', { name: /Owner Dashboard/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Admin Console/i })).not.toBeInTheDocument()
    })
})
