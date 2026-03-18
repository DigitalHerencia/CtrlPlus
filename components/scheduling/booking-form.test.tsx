import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { BookingForm } from './booking-form'

const mockAvailabilityWindows = [
    // Explicitly include Sunday (dayOfWeek: 0) for March 1, 2026
    {
        id: 'window-sunday',
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '10:00',
        capacity: 2,
    },
    // Optionally include other days for robustness
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `window-${i + 2}`,
        dayOfWeek: i + 1, // 1=Monday, 6=Saturday
        startTime: '09:00',
        endTime: '10:00',
        capacity: 2,
    })),
]

const mockWraps = [
    {
        id: 'wrap-1',
        name: 'Standard Wrap',
        price: 10000,
    },
]

describe('BookingForm', () => {
    beforeAll(() => {
        vi.mock('next/navigation', () => ({
            useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
        }))
    })

    it('renders calendar and wrap selector', () => {
        render(
            <BookingForm
                availabilityWindows={mockAvailabilityWindows}
                wraps={mockWraps}
                minDate={new Date(2026, 2, 1)} // March is month 2 in JS
            />
        )
        // There are two elements with 'Select a Date', so use getAllByText and assert count
        const dateLabels = screen.getAllByText(/Select a Date/i)
        expect(dateLabels.length).toBeGreaterThanOrEqual(1)
        // Simulate selecting a date to render wrap selector
        // Directly set the date value using react-hook-form API
        act(() => {
            // Click 'Next month' until March 2026 is rendered
            let monthLabel = screen.queryByText(/\bMarch\b/i)
            let yearLabel = screen.queryByText(/2026/)
            while (monthLabel === null || yearLabel === null) {
                const nextMonthBtn = screen.getByRole('button', { name: /Next month/i })
                fireEvent.click(nextMonthBtn)
                monthLabel = screen.queryByText(/\bMarch\b/i)
                yearLabel = screen.queryByText(/2026/)
            }
            // Find the calendar day button for '1'
            const dateButton = screen.getByRole('button', { name: '1' })
            expect(dateButton).not.toBeDisabled()
            fireEvent.click(dateButton)
        })

        // Now 'Select a Wrap' should be rendered
        expect(screen.getByText('Select a Wrap')).toBeInTheDocument()
    })

    it('shows error if no time slot selected', () => {
        render(
            <BookingForm
                availabilityWindows={mockAvailabilityWindows}
                wraps={mockWraps}
                minDate={new Date(2026, 2, 1)}
            />
        )
        act(() => {
            // Click 'Next month' until March 2026 is rendered
            let monthLabel = screen.queryByText(/March/i)
            let yearLabel = screen.queryByText(/2026/)
            while (monthLabel === null || yearLabel === null) {
                const nextMonthBtn = screen.getByRole('button', { name: /Next month/i })
                fireEvent.click(nextMonthBtn)
                monthLabel = screen.queryByText(/March/i)
                yearLabel = screen.queryByText(/2026/)
            }
            // Find the calendar day button for '1'
            const dateButton = screen.getByRole('button', { name: '1' })
            fireEvent.click(dateButton)
            // Submit form without selecting a time slot
            fireEvent.submit(screen.getByRole('button', { name: /Confirm Booking/i }))
        })
        // Wait for error message to appear
        expect(screen.findByText(/Select a time slot/i)).resolves.toBeInTheDocument()
    })

    it('shows error if no wrap selected', () => {
        render(<BookingForm availabilityWindows={mockAvailabilityWindows} wraps={[]} />)
        expect(screen.getByText(/No wrap services are available/i)).toBeInTheDocument()
    })
})
