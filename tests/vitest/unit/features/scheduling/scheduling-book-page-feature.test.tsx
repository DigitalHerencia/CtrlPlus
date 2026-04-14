import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getAvailabilityWindows: vi.fn(),
    getUserSettingsView: vi.fn(),
}))

vi.mock('@/lib/fetchers/scheduling.fetchers', () => ({
    getAvailabilityWindows: mocks.getAvailabilityWindows,
}))

vi.mock('@/lib/fetchers/settings.fetchers', () => ({
    getUserSettingsView: mocks.getUserSettingsView,
}))

vi.mock('@/features/scheduling/scheduling-booking-form-client', () => ({
    SchedulingBookingFormClient: () => <div>booking form client</div>,
}))

describe('SchedulingBookPageFeature', () => {
    it('renders appointment-focused scheduling copy', async () => {
        mocks.getAvailabilityWindows.mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            pageSize: 20,
            totalPages: 0,
        })
        mocks.getUserSettingsView.mockResolvedValue({})

        const { SchedulingBookPageFeature } =
            await import('@/features/scheduling/scheduling-book-page-feature')

        render(await SchedulingBookPageFeature())

        expect(screen.getByRole('heading', { name: /Book Appointment/i })).toBeVisible()
        expect(screen.getAllByRole('link', { name: /My Appointments/i })[0]).toHaveAttribute(
            'href',
            '/scheduling/bookings'
        )
        expect(screen.getByText(/booking form client/i)).toBeVisible()
        expect(screen.getByText(/Set your appointment time and submit your request/i)).toBeVisible()
        expect(screen.getByText(/temporary hourly slots from 9:00 AM to 5:00 PM/i)).toBeVisible()
    })
})
