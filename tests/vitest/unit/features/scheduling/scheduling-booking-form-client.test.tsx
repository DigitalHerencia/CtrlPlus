import '@testing-library/jest-dom'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    createBooking: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
}))

vi.mock('@/lib/actions/scheduling.actions', () => ({
    createBooking: mocks.createBooking,
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mocks.push,
        refresh: mocks.refresh,
    }),
}))

vi.mock('@/components/scheduling/calendar-client', () => ({
    CalendarClient: ({ onDateSelect }: { onDateSelect?: (date: Date) => void }) => (
        <button type="button" onClick={() => onDateSelect?.(new Date(2026, 2, 1))}>
            Select March 1
        </button>
    ),
}))

import { SchedulingBookingFormClient } from '@/features/scheduling/scheduling-booking-form-client'

describe('SchedulingBookingFormClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.createBooking.mockResolvedValue({
            invoiceId: 'invoice-1',
        })
    })

    it('collects date, slot, and wrap selection before creating a booking', async () => {
        render(
            <SchedulingBookingFormClient
                availabilityWindows={[
                    {
                        id: 'window-1',
                        dayOfWeek: 0,
                        startTime: '09:00',
                        endTime: '10:00',
                        capacity: 2,
                    },
                ]}
                wraps={[
                    {
                        id: 'wrap-1',
                        name: 'Standard Wrap',
                        price: 10000,
                    },
                ]}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: /Select March 1/i }))
        fireEvent.click(screen.getByRole('button', { name: /9:00 AM/i }))
        fireEvent.click(screen.getByRole('button', { name: /Standard Wrap/i }))
        fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }))

        await waitFor(() =>
            expect(mocks.createBooking).toHaveBeenCalledWith({
                wrapId: 'wrap-1',
                startTime: new Date(2026, 2, 1, 9, 0, 0, 0).toISOString(),
                endTime: new Date(2026, 2, 1, 10, 0, 0, 0).toISOString(),
            })
        )
        expect(mocks.push).toHaveBeenCalledWith('/billing/invoice-1')
        expect(mocks.refresh).toHaveBeenCalled()
    })

    it('surfaces server errors without leaving the page', async () => {
        mocks.createBooking.mockRejectedValue(new Error('The requested time slot is fully booked'))

        render(
            <SchedulingBookingFormClient
                availabilityWindows={[
                    {
                        id: 'window-1',
                        dayOfWeek: 0,
                        startTime: '09:00',
                        endTime: '10:00',
                        capacity: 2,
                    },
                ]}
                wraps={[
                    {
                        id: 'wrap-1',
                        name: 'Standard Wrap',
                        price: 10000,
                    },
                ]}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: /Select March 1/i }))
        fireEvent.click(screen.getByRole('button', { name: /9:00 AM/i }))
        fireEvent.click(screen.getByRole('button', { name: /Standard Wrap/i }))
        fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }))

        await expect(
            screen.findByText(/The requested time slot is fully booked/i)
        ).resolves.toBeVisible()
        expect(mocks.push).not.toHaveBeenCalled()
    })
})
