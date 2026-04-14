import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getAvailabilityWindows: vi.fn(),
    getActiveBookingDraft: vi.fn(),
    getUserSettingsView: vi.fn(),
}))

vi.mock('@/lib/fetchers/scheduling.fetchers', () => ({
    getAvailabilityWindows: mocks.getAvailabilityWindows,
    getActiveBookingDraft: mocks.getActiveBookingDraft,
}))

vi.mock('@/lib/fetchers/settings.fetchers', () => ({
    getUserSettingsView: mocks.getUserSettingsView,
}))

vi.mock('@/features/scheduling/scheduling-booking-form-client', () => ({
    SchedulingBookingFormClient: () => <div>booking form client</div>,
}))

describe('SchedulingBookPageFeature', () => {
    it('uses customer-facing copy when no draft is available', async () => {
        mocks.getAvailabilityWindows.mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            pageSize: 20,
            totalPages: 0,
        })
        mocks.getActiveBookingDraft.mockResolvedValue(null)
        mocks.getUserSettingsView.mockResolvedValue({})

        const { SchedulingBookPageFeature } = await import(
            '@/features/scheduling/scheduling-book-page-feature'
        )

        render(await SchedulingBookPageFeature({ canViewHiddenWraps: false }))

        expect(screen.getByRole('heading', { name: /Book Appointment/i })).toBeVisible()
        expect(screen.getByRole('link', { name: /My Appointments/i })).toHaveAttribute(
            'href',
            '/scheduling/bookings'
        )
        expect(screen.getByText(/Choose a wrap before booking/i)).toBeVisible()
        expect(screen.queryByText(/Booking Navigation/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/configure scheduling windows/i)).not.toBeInTheDocument()
    })

    it('shows a customer-focused no-availability state without manager language', async () => {
        mocks.getAvailabilityWindows.mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            pageSize: 20,
            totalPages: 0,
        })
        mocks.getActiveBookingDraft.mockResolvedValue({
            id: 'draft-1',
        })
        mocks.getUserSettingsView.mockResolvedValue({})

        const { SchedulingBookPageFeature } = await import(
            '@/features/scheduling/scheduling-book-page-feature'
        )

        render(await SchedulingBookPageFeature({ canViewHiddenWraps: false }))

        expect(screen.getByText(/No appointment times are available right now/i)).toBeVisible()
        expect(screen.queryByText(/Review Calendar/i)).not.toBeInTheDocument()
    })
})
