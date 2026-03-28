'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { BookingForm } from '@/components/scheduling/booking-form'
import { createBooking } from '@/lib/actions/scheduling.actions'
import { bookingFormSchema } from '@/schema/scheduling'
import { type BookingFormValues, type SchedulingBookingFormClientProps } from '@/types/scheduling'

function buildDateTime(date: Date, time: string): Date {
    const [hourPart, minutePart = '0'] = time.split(':')
    const nextDate = new Date(date)
    nextDate.setHours(Number(hourPart), Number(minutePart), 0, 0)
    return nextDate
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error && error.message.trim().length > 0
        ? error.message
        : 'Failed to create booking.'
}

export function SchedulingBookingFormClient({
    availabilityWindows,
    wraps,
    minDate,
}: SchedulingBookingFormClientProps) {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const form = useForm<BookingFormValues>({
        mode: 'onBlur',
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            date: undefined,
            windowId: '',
            wrapId: wraps[0]?.id ?? '',
        },
    })

    const selectedDate = (useWatch({ control: form.control, name: 'date' }) ?? null) as Date | null
    const selectedWindowId = useWatch({ control: form.control, name: 'windowId' }) ?? ''
    const selectedWrapId = useWatch({ control: form.control, name: 'wrapId' }) ?? ''

    useEffect(() => {
        if (wraps.length > 0 && !form.getValues('wrapId')) {
            form.setValue('wrapId', wraps[0].id, { shouldValidate: true })
        }
    }, [form, wraps])

    function handleDateSelect(date: Date) {
        setServerError(null)
        form.setValue('date', date, { shouldValidate: true })
        form.setValue('windowId', '', { shouldValidate: true })
    }

    function handleWindowSelect(windowId: string) {
        setServerError(null)
        form.setValue('windowId', windowId, { shouldValidate: true })
    }

    function handleWrapSelect(wrapId: string) {
        setServerError(null)
        form.setValue('wrapId', wrapId, { shouldValidate: true })
    }

    const handleSubmit = form.handleSubmit(async (values) => {
        setServerError(null)

        const window = availabilityWindows.find((item) => item.id === values.windowId)
        if (!window) {
            form.setError('windowId', {
                type: 'validate',
                message: 'Select a time slot.',
            })
            return
        }

        const startTime = buildDateTime(values.date, window.startTime)
        const endTime = buildDateTime(values.date, window.endTime)

        try {
            const booking = await createBooking({
                wrapId: values.wrapId,
                startTime,
                endTime,
            })

            router.push(`/billing/${booking.invoiceId}`)
            router.refresh()
        } catch (error) {
            setServerError(getErrorMessage(error))
        }
    })

    return (
        <BookingForm
            availabilityWindows={availabilityWindows}
            wraps={wraps}
            selectedDate={selectedDate}
            selectedWindowId={selectedWindowId}
            selectedWrapId={selectedWrapId}
            errors={{
                date: form.formState.errors.date?.message,
                windowId: form.formState.errors.windowId?.message,
                wrapId: form.formState.errors.wrapId?.message,
                root: serverError ?? undefined,
            }}
            isPending={form.formState.isSubmitting}
            minDate={minDate}
            onSubmit={handleSubmit}
            onDateSelect={handleDateSelect}
            onWindowSelect={handleWindowSelect}
            onWrapSelect={handleWrapSelect}
        />
    )
}
