'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { BookingDateFields } from '@/components/scheduling/booking-form/booking-date-fields'
import { BookingFormActions } from '@/components/scheduling/booking-form/booking-form-actions'
import { BookingFormFields } from '@/components/scheduling/booking-form/booking-form-fields'
import { BookingFormShell } from '@/components/scheduling/booking-form/booking-form-shell'
import { updateBooking } from '@/lib/actions/scheduling.actions'

import { BookingCalendarClient } from './booking-calendar.client'
import { BookingSlotPickerClient } from './booking-slot-picker.client'

interface AvailabilityWindowOption {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacity: number
}

interface BookingFormClientProps {
    availabilityWindows: AvailabilityWindowOption[]
    bookingId: string
    initialDate?: Date
    initialWindowId?: string
    isManageView?: boolean
}

type BookingFormValues = {
    date?: Date
    windowId: string
}

function buildDateTime(date: Date, hhmm: string): Date {
    const [hourPart, minutePart = '0'] = hhmm.split(':')
    const nextDate = new Date(date)
    nextDate.setHours(Number(hourPart), Number(minutePart), 0, 0)
    return nextDate
}

/**
 * BookingFormClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingFormClient({
    availabilityWindows,
    bookingId,
    initialDate,
    initialWindowId,
    isManageView = false,
}: BookingFormClientProps) {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ?? null)
    const [selectedWindowId, setSelectedWindowId] = useState(initialWindowId ?? '')

    const form = useForm<BookingFormValues>({
        defaultValues: {
            date: initialDate,
            windowId: initialWindowId ?? '',
        },
    })

    const availableWeekdays = useMemo(
        () => [...new Set(availabilityWindows.map((window) => window.dayOfWeek))],
        [availabilityWindows]
    )

    const slotsForDate = useMemo(() => {
        if (!selectedDate) {
            return []
        }

        return availabilityWindows.filter((window) => window.dayOfWeek === selectedDate.getDay())
    }, [availabilityWindows, selectedDate])

    const submit = form.handleSubmit(async (values) => {
        setServerError(null)
        const selectedWindow = availabilityWindows.find((window) => window.id === values.windowId)

        if (!values.date || !selectedWindow) {
            setServerError('Please select a valid date and slot.')
            return
        }

        const startTime = buildDateTime(values.date, selectedWindow.startTime)
        const endTime = buildDateTime(values.date, selectedWindow.endTime)

        try {
            await updateBooking(bookingId, {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            })

            const detailPath = isManageView
                ? `/scheduling/manage/${bookingId}`
                : `/scheduling/${bookingId}`
            router.push(detailPath)
            router.refresh()
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Unable to update appointment')
        }
    })

    return (
        <form onSubmit={submit} className="space-y-4">
            <BookingFormShell
                title={isManageView ? 'Edit Appointment' : 'Create Booking'}
                description={
                    isManageView
                        ? 'Adjust appointment date and time, then save your changes.'
                        : 'Pick slot, collect customer information, and submit booking.'
                }
            >
                <BookingFormFields>
                    <BookingDateFields
                        calendar={
                            <BookingCalendarClient
                                availableWeekdays={availableWeekdays}
                                selectedDate={selectedDate ?? null}
                                onDateSelect={(date) => {
                                    setServerError(null)
                                    setSelectedDate(date)
                                    setSelectedWindowId('')
                                    form.setValue('date', date, { shouldValidate: true })
                                    form.setValue('windowId', '', { shouldValidate: true })
                                }}
                            />
                        }
                        slotPicker={
                            <BookingSlotPickerClient
                                slots={slotsForDate}
                                selectedSlotId={selectedWindowId}
                                onSelectSlot={(slotId) => {
                                    setServerError(null)
                                    setSelectedWindowId(slotId)
                                    form.setValue('windowId', slotId, { shouldValidate: true })
                                }}
                                disabled={form.formState.isSubmitting}
                            />
                        }
                        error={form.formState.errors.windowId?.message}
                    />
                </BookingFormFields>

                {serverError ? <p className="text-sm text-red-400">{serverError}</p> : null}

                <BookingFormActions
                    isPending={form.formState.isSubmitting}
                    submitLabel="Save Appointment Changes"
                />
            </BookingFormShell>
        </form>
    )
}
