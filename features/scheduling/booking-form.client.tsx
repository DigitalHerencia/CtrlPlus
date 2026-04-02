'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { BookingContactFields } from '@/components/scheduling/booking-form/booking-contact-fields'
import { BookingDateFields } from '@/components/scheduling/booking-form/booking-date-fields'
import { BookingFormActions } from '@/components/scheduling/booking-form/booking-form-actions'
import { BookingFormFields } from '@/components/scheduling/booking-form/booking-form-fields'
import { BookingFormShell } from '@/components/scheduling/booking-form/booking-form-shell'
import { BookingNotesFields } from '@/components/scheduling/booking-form/booking-notes-fields'
import { createBooking, updateBooking } from '@/lib/actions/scheduling.actions'

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
    wraps: Array<{ id: string; name: string; price: number }>
    bookingId?: string
    initialDate?: Date
    initialWindowId?: string
    isManageView?: boolean
}

type BookingFormValues = {
    date?: Date
    windowId: string
    wrapId: string
}

function buildDateTime(date: Date, hhmm: string): Date {
    const [hourPart, minutePart = '0'] = hhmm.split(':')
    const nextDate = new Date(date)
    nextDate.setHours(Number(hourPart), Number(minutePart), 0, 0)
    return nextDate
}

export function BookingFormClient({
    availabilityWindows,
    wraps,
    bookingId,
    initialDate,
    initialWindowId,
    isManageView = false,
}: BookingFormClientProps) {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ?? null)
    const [selectedWindowId, setSelectedWindowId] = useState(initialWindowId ?? '')
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [notes, setNotes] = useState('')

    const form = useForm<BookingFormValues>({
        defaultValues: {
            date: initialDate,
            windowId: initialWindowId ?? '',
            wrapId: wraps[0]?.id ?? '',
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
            if (bookingId) {
                await updateBooking(bookingId, {
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                })

                const detailPath = isManageView
                    ? `/scheduling/manage/${bookingId}`
                    : `/scheduling/${bookingId}`
                router.push(detailPath)
            } else {
                const created = await createBooking({
                    wrapId: values.wrapId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                })

                const destination = isManageView
                    ? `/scheduling/manage/${created.id}`
                    : `/scheduling/${created.id}`
                router.push(destination)
            }

            router.refresh()
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Unable to save booking')
        }
    })

    return (
        <form onSubmit={submit} className="space-y-4">
            <BookingFormShell>
                <BookingFormFields>
                    <BookingDateFields
                        calendar={
                            <BookingCalendarClient
                                availableWeekdays={availableWeekdays}
                                selectedDate={selectedDate ?? null}
                                onDateSelect={(date) => {
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
                                    setSelectedWindowId(slotId)
                                    form.setValue('windowId', slotId, { shouldValidate: true })
                                }}
                                disabled={form.formState.isSubmitting}
                            />
                        }
                        error={form.formState.errors.windowId?.message}
                    />

                    <BookingContactFields
                        customerName={customerName}
                        customerEmail={customerEmail}
                        customerPhone={customerPhone}
                        onCustomerNameChange={setCustomerName}
                        onCustomerEmailChange={setCustomerEmail}
                        onCustomerPhoneChange={setCustomerPhone}
                    />

                    <BookingNotesFields notes={notes} onNotesChange={setNotes} />
                </BookingFormFields>

                {serverError ? <p className="text-sm text-red-400">{serverError}</p> : null}

                <BookingFormActions
                    isPending={form.formState.isSubmitting}
                    submitLabel={bookingId ? 'Save Changes' : 'Create Booking'}
                />
            </BookingFormShell>
        </form>
    )
}
