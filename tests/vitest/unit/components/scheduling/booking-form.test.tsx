import '@testing-library/jest-dom/vitest'

import { fireEvent, render, screen } from '@testing-library/react'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { BookingForm } from '@/components/scheduling/booking-form'

const mockAvailabilityWindows = [
    {
        id: 'window-sunday',
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '10:00',
        capacity: 2,
    },
]

const mockWraps = [
    {
        id: 'wrap-1',
        name: 'Standard Wrap',
        price: 10000,
    },
]

describe('BookingForm', () => {
    it('renders the selected schedule and delegates slot, wrap, and submit interactions', () => {
        const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())
        const onWindowSelect = vi.fn()
        const onWrapSelect = vi.fn()

        render(
            <BookingForm
                availabilityWindows={mockAvailabilityWindows}
                wraps={mockWraps}
                selectedDate={new Date(2026, 2, 1)}
                selectedWindowId="window-sunday"
                selectedWrapId="wrap-1"
                onSubmit={onSubmit}
                onDateSelect={vi.fn()}
                onWindowSelect={onWindowSelect}
                onWrapSelect={onWrapSelect}
            />
        )

        expect(screen.getByText(/Available Times for Sunday, March 1, 2026/i)).toBeVisible()
        expect(screen.getByRole('button', { name: /9:00 AM/i })).toBeVisible()
        expect(screen.getByRole('button', { name: /Standard Wrap/i })).toBeVisible()

        fireEvent.click(screen.getByRole('button', { name: /9:00 AM/i }))
        fireEvent.click(screen.getByRole('button', { name: /Standard Wrap/i }))
        const form = screen.getByRole('button', { name: /Confirm Booking/i }).closest('form')
        expect(form).not.toBeNull()
        fireEvent.submit(form as HTMLFormElement)

        expect(onWindowSelect).toHaveBeenCalledWith('window-sunday')
        expect(onWrapSelect).toHaveBeenCalledWith('wrap-1')
        expect(onSubmit).toHaveBeenCalled()
    })

    it('shows empty-state copy when wraps are unavailable', () => {
        render(
            <BookingForm
                availabilityWindows={mockAvailabilityWindows}
                wraps={[]}
                selectedDate={new Date(2026, 2, 1)}
                selectedWindowId=""
                selectedWrapId=""
                onSubmit={vi.fn()}
                onDateSelect={vi.fn()}
                onWindowSelect={vi.fn()}
                onWrapSelect={vi.fn()}
            />
        )

        expect(
            screen.getByText(/No wrap services are available for booking at this time/i)
        ).toBeVisible()
    })
})
