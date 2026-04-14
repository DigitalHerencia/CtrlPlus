'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { type Resolver, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createBooking } from '@/lib/actions/scheduling.actions'
import { bookingFormSchema } from '@/schemas/scheduling.schemas'
import type { UserSettingsViewDTO } from '@/types/settings.types'

import { BookingCalendarClient } from './booking-calendar.client'
import { BookingSlotPickerClient } from './booking-slot-picker.client'

interface SchedulingBookingFormClientProps {
    availabilityWindows: Array<{
        id: string
        dayOfWeek: number
        startTime: string
        endTime: string
        capacity: number
    }>
    initialSettings: UserSettingsViewDTO
    minDate?: Date
}

type BookingFormValues = z.infer<typeof bookingFormSchema>

export function SchedulingBookingFormClient({
    availabilityWindows,
    initialSettings,
    minDate,
}: SchedulingBookingFormClientProps) {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const form = useForm<BookingFormValues>({
        mode: 'onBlur',
        resolver: zodResolver(bookingFormSchema) as unknown as Resolver<BookingFormValues>,
        defaultValues: {
            date: undefined,
            windowId: '',
            customerName: initialSettings.fullName ?? '',
            customerEmail: initialSettings.email ?? '',
            customerPhone: initialSettings.phone ?? '',
            preferredContact: initialSettings.preferredContact,
            billingAddressLine1: initialSettings.billingAddressLine1 ?? '',
            billingAddressLine2: initialSettings.billingAddressLine2 ?? '',
            billingCity: initialSettings.billingCity ?? '',
            billingState: initialSettings.billingState ?? '',
            billingPostalCode: initialSettings.billingPostalCode ?? '',
            billingCountry: initialSettings.billingCountry ?? 'US',
            vehicleMake: initialSettings.vehicleMake ?? '',
            vehicleModel: initialSettings.vehicleModel ?? '',
            vehicleYear: initialSettings.vehicleYear ?? '',
            vehicleTrim: initialSettings.vehicleTrim ?? '',
            previewImageUrl: '',
            previewPromptUsed: '',
            notes: '',
        },
    })

    const selectedDate = (useWatch({ control: form.control, name: 'date' }) ?? null) as Date | null
    const selectedWindowId = useWatch({ control: form.control, name: 'windowId' }) ?? ''

    const availableWeekdays = useMemo(
        () => [...new Set(availabilityWindows.map((window) => window.dayOfWeek))],
        [availabilityWindows]
    )
    const windowsForDate = useMemo(() => {
        if (!selectedDate) {
            return []
        }
        return availabilityWindows.filter((window) => window.dayOfWeek === selectedDate.getDay())
    }, [availabilityWindows, selectedDate])

    const handleSubmit = form.handleSubmit(
        async (values) => {
            setServerError(null)
            const window = availabilityWindows.find((item) => item.id === values.windowId)
            if (!window) {
                form.setError('windowId', { type: 'validate', message: 'Select a time slot.' })
                return
            }

            const startTime = buildDateTime(values.date, window.startTime)
            const endTime = buildDateTime(values.date, window.endTime)

            try {
                const booking = await createBooking({
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    customerName: values.customerName,
                    customerEmail: values.customerEmail,
                    customerPhone: values.customerPhone,
                    preferredContact: values.preferredContact,
                    billingAddressLine1: values.billingAddressLine1,
                    billingAddressLine2: values.billingAddressLine2,
                    billingCity: values.billingCity,
                    billingState: values.billingState,
                    billingPostalCode: values.billingPostalCode,
                    billingCountry: values.billingCountry,
                    vehicleMake: values.vehicleMake,
                    vehicleModel: values.vehicleModel,
                    vehicleYear: values.vehicleYear,
                    vehicleTrim: values.vehicleTrim,
                    notes: values.notes,
                })

                router.push(`/scheduling/${booking.id}`)
                router.refresh()
            } catch (error) {
                setServerError(error instanceof Error ? error.message : 'Failed to create booking.')
            }
        },
        () => {
            setServerError('Please complete the required appointment details and try again.')
        }
    )

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl space-y-8">
            {serverError ? (
                <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                    {serverError}
                </div>
            ) : null}

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                        Appointments
                    </h2>
                    <p className="text-sm text-neutral-400">
                        Pick a date first, then choose the time that works best for your
                        installation.
                    </p>
                    <div className="space-y-4">
                        <BookingCalendarClient
                            availableWeekdays={availableWeekdays}
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                                setServerError(null)
                                form.setValue('date', date, { shouldValidate: true })
                                form.setValue('windowId', '', { shouldValidate: true })
                            }}
                            minDate={minDate}
                        />
                        {selectedDate ? (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-neutral-100">
                                    Available time slots
                                </p>
                                <BookingSlotPickerClient
                                    slots={windowsForDate}
                                    selectedSlotId={selectedWindowId}
                                    onSelectSlot={(slotId) => {
                                        setServerError(null)
                                        form.setValue('windowId', slotId, { shouldValidate: true })
                                    }}
                                    disabled={form.formState.isSubmitting}
                                />
                                {form.formState.errors.windowId?.message ? (
                                    <p className="text-sm text-red-400">
                                        {form.formState.errors.windowId.message}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                        Contact information
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <Label
                                className="block text-sm font-medium text-neutral-100"
                                htmlFor="customerName"
                            >
                                Full name
                            </Label>
                            <Input
                                id="customerName"
                                className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                {...form.register('customerName')}
                            />
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="customerEmail"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('customerEmail')}
                                />
                            </div>
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="customerPhone"
                                >
                                    Phone
                                </Label>
                                <Input
                                    id="customerPhone"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('customerPhone')}
                                />
                            </div>
                        </div>
                        <div>
                            <Label
                                className="block text-sm font-medium text-neutral-100"
                                htmlFor="preferredContact"
                            >
                                Preferred notification channel
                            </Label>
                            <select
                                id="preferredContact"
                                className="mt-1 h-8 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 text-sm text-neutral-100 outline-none transition"
                                {...form.register('preferredContact')}
                            >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                        Billing information
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <Label
                                className="block text-sm font-medium text-neutral-100"
                                htmlFor="billingAddressLine1"
                            >
                                Street address
                            </Label>
                            <Input
                                id="billingAddressLine1"
                                className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                {...form.register('billingAddressLine1')}
                            />
                        </div>
                        <div>
                            <Label
                                className="block text-sm font-medium text-neutral-100"
                                htmlFor="billingAddressLine2"
                            >
                                Apartment, suite, etc. (optional)
                            </Label>
                            <Input
                                id="billingAddressLine2"
                                className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                {...form.register('billingAddressLine2')}
                            />
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="billingCity"
                                >
                                    City
                                </Label>
                                <Input
                                    id="billingCity"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('billingCity')}
                                />
                            </div>
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="billingState"
                                >
                                    State
                                </Label>
                                <Input
                                    id="billingState"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('billingState')}
                                />
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="billingPostalCode"
                                >
                                    Postal code
                                </Label>
                                <Input
                                    id="billingPostalCode"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('billingPostalCode')}
                                />
                            </div>
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="billingCountry"
                                >
                                    Country
                                </Label>
                                <Input
                                    id="billingCountry"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('billingCountry')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                        Vehicle information
                    </h2>
                    <div className="space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="vehicleMake"
                                >
                                    Make
                                </Label>
                                <Input
                                    id="vehicleMake"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('vehicleMake')}
                                />
                            </div>
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="vehicleModel"
                                >
                                    Model
                                </Label>
                                <Input
                                    id="vehicleModel"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('vehicleModel')}
                                />
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="vehicleYear"
                                >
                                    Year
                                </Label>
                                <Input
                                    id="vehicleYear"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('vehicleYear')}
                                />
                            </div>
                            <div>
                                <Label
                                    className="block text-sm font-medium text-neutral-100"
                                    htmlFor="vehicleTrim"
                                >
                                    Trim
                                </Label>
                                <Input
                                    id="vehicleTrim"
                                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                    {...form.register('vehicleTrim')}
                                />
                            </div>
                        </div>
                        <div>
                            <Label
                                className="block text-sm font-medium text-neutral-100"
                                htmlFor="notes"
                            >
                                Notes for the shop (optional)
                            </Label>
                            <Textarea
                                id="notes"
                                rows={4}
                                className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 placeholder:text-neutral-500"
                                {...form.register('notes')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="border-2 border-transparent bg-blue-600 px-6 py-3 text-base font-semibold text-neutral-100 shadow-lg transition-all hover:border-blue-600 hover:bg-transparent hover:text-blue-600 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
            >
                {form.formState.isSubmitting ? (
                    <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Creating appointment…
                    </>
                ) : (
                    'Create Appointment'
                )}
            </Button>
        </form>
    )
}
