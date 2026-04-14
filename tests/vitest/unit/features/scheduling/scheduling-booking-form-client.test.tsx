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

vi.mock('@/features/scheduling/booking-calendar.client', () => ({
    BookingCalendarClient: ({ onDateSelect }: { onDateSelect?: (date: Date) => void }) => (
        <button type="button" onClick={() => onDateSelect?.(new Date(2026, 2, 1))}>
            Select March 1
        </button>
    ),
}))

vi.mock('@/features/scheduling/booking-slot-picker.client', () => ({
    BookingSlotPickerClient: ({
        slots,
        onSelectSlot,
    }: {
        slots: Array<{ id: string; startTime: string }>
        onSelectSlot?: (slotId: string) => void
    }) => (
        <div>
            {slots.map((slot) => (
                <button key={slot.id} type="button" onClick={() => onSelectSlot?.(slot.id)}>
                    {slot.startTime}
                </button>
            ))}
        </div>
    ),
}))

import { SchedulingBookingFormClient } from '@/features/scheduling/scheduling-booking-form-client'

const initialSettings = {
    userId: 'user-1',
    theme: 'system',
    language: 'en',
    timezone: 'America/Denver',
    notifications: {
        email: true,
        sms: false,
        push: false,
    },
    preferredContact: 'email',
    appointmentReminders: true,
    marketingOptIn: false,
    fullName: 'Taylor Driver',
    email: 'taylor@example.com',
    phone: '5551234567',
    billingAddressLine1: '123 Main St',
    billingAddressLine2: null,
    billingCity: 'Denver',
    billingState: 'CO',
    billingPostalCode: '80202',
    billingCountry: 'US',
    vehicleMake: 'Ford',
    vehicleModel: 'Mustang',
    vehicleYear: '2022',
    vehicleTrim: 'GT',
    stripeCustomerId: null,
    stripeDefaultPaymentMethodBrand: 'visa',
    stripeDefaultPaymentMethodLast4: '4242',
    updatedAt: '2026-03-01T00:00:00.000Z',
} as const

describe('SchedulingBookingFormClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.createBooking.mockResolvedValue({
            id: 'booking-1',
        })
    })

    it('submits a booking request and redirects to the booking detail page', async () => {
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
                initialSettings={initialSettings}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: /Select March 1/i }))
        fireEvent.click(screen.getByRole('button', { name: /^09:00$/i }))
        fireEvent.click(screen.getByRole('button', { name: /Create Booking/i }))

        await waitFor(() =>
            expect(mocks.createBooking).toHaveBeenCalledWith({
                startTime: new Date(2026, 2, 1, 9, 0, 0, 0).toISOString(),
                endTime: new Date(2026, 2, 1, 10, 0, 0, 0).toISOString(),
                customerName: 'Taylor Driver',
                customerEmail: 'taylor@example.com',
                customerPhone: '5551234567',
                preferredContact: 'email',
                billingAddressLine1: '123 Main St',
                billingAddressLine2: '',
                billingCity: 'Denver',
                billingState: 'CO',
                billingPostalCode: '80202',
                billingCountry: 'US',
                vehicleMake: 'Ford',
                vehicleModel: 'Mustang',
                vehicleYear: '2022',
                vehicleTrim: 'GT',
                notes: '',
            })
        )
        expect(mocks.push).toHaveBeenCalledWith('/scheduling/booking-1')
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
                initialSettings={initialSettings}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: /Select March 1/i }))
        fireEvent.click(screen.getByRole('button', { name: /^09:00$/i }))
        fireEvent.click(screen.getByRole('button', { name: /Create Booking/i }))

        await expect(
            screen.findByText(/The requested time slot is fully booked/i)
        ).resolves.toBeVisible()
        expect(mocks.push).not.toHaveBeenCalled()
    })
})
