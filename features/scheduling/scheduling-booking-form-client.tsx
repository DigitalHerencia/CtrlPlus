'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { type Resolver, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const FIELD_LABEL_CLASS = 'text-xs font-semibold uppercase tracking-[0.18em] text-neutral-300'
const INPUT_CLASS =
    'h-11 border-neutral-700 bg-neutral-950 text-sm text-neutral-100 placeholder:text-neutral-500'
const SELECT_CLASS =
    'h-11 w-full border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500'
const TEXTAREA_CLASS =
    'min-h-28 border-neutral-700 bg-neutral-950 text-sm text-neutral-100 placeholder:text-neutral-500'

function buildDateTime(date: Date, time: string): Date {
    const [hourPart, minutePart = '0'] = time.split(':')
    const nextDate = new Date(date)
    nextDate.setHours(Number(hourPart), Number(minutePart), 0, 0)
    return nextDate
}

/**
 * SchedulingBookingFormClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="space-y-5">
                    <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-base">Choose appointment time</CardTitle>
                            <p className="text-sm text-neutral-400">
                                Pick a date first, then choose the time that works best for your
                                installation.
                            </p>
                        </CardHeader>
                        <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
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
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className={FIELD_LABEL_CLASS}>Available time slots</p>
                                    <p className="text-sm text-neutral-400">
                                        Select one open window to continue.
                                    </p>
                                </div>
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
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-5 xl:min-h-full">
                    <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-base">Appointment focus</CardTitle>
                            <p className="text-sm text-neutral-400">
                                Book a consultation, install planning session, or standalone service
                                appointment.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4 border border-dashed border-neutral-700 px-4 py-6 text-sm text-neutral-400">
                                <p>
                                    Choose your date and time, then provide contact and vehicle
                                    details so the shop can confirm the appointment.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Contact details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="customerName">
                                    Full name
                                </Label>
                                <Input
                                    id="customerName"
                                    className={INPUT_CLASS}
                                    {...form.register('customerName')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="customerEmail">
                                    Email
                                </Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    className={INPUT_CLASS}
                                    {...form.register('customerEmail')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="customerPhone">
                                    Phone
                                </Label>
                                <Input
                                    id="customerPhone"
                                    className={INPUT_CLASS}
                                    {...form.register('customerPhone')}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="preferredContact">
                                    Preferred notification channel
                                </Label>
                                <select
                                    id="preferredContact"
                                    className={SELECT_CLASS}
                                    {...form.register('preferredContact')}
                                >
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Billing details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="billingAddressLine1">
                                    Billing address
                                </Label>
                                <Input
                                    id="billingAddressLine1"
                                    className={INPUT_CLASS}
                                    {...form.register('billingAddressLine1')}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="billingAddressLine2">
                                    Address line 2
                                </Label>
                                <Input
                                    id="billingAddressLine2"
                                    className={INPUT_CLASS}
                                    {...form.register('billingAddressLine2')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="billingCity">
                                    City
                                </Label>
                                <Input
                                    id="billingCity"
                                    className={INPUT_CLASS}
                                    {...form.register('billingCity')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="billingState">
                                    State
                                </Label>
                                <Input
                                    id="billingState"
                                    className={INPUT_CLASS}
                                    {...form.register('billingState')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="billingPostalCode">
                                    Postal code
                                </Label>
                                <Input
                                    id="billingPostalCode"
                                    className={INPUT_CLASS}
                                    {...form.register('billingPostalCode')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="billingCountry">
                                    Country
                                </Label>
                                <Input
                                    id="billingCountry"
                                    className={INPUT_CLASS}
                                    {...form.register('billingCountry')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Vehicle details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="vehicleMake">
                                    Make
                                </Label>
                                <Input
                                    id="vehicleMake"
                                    className={INPUT_CLASS}
                                    {...form.register('vehicleMake')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="vehicleModel">
                                    Model
                                </Label>
                                <Input
                                    id="vehicleModel"
                                    className={INPUT_CLASS}
                                    {...form.register('vehicleModel')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="vehicleYear">
                                    Year
                                </Label>
                                <Input
                                    id="vehicleYear"
                                    className={INPUT_CLASS}
                                    {...form.register('vehicleYear')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="vehicleTrim">
                                    Trim
                                </Label>
                                <Input
                                    id="vehicleTrim"
                                    className={INPUT_CLASS}
                                    {...form.register('vehicleTrim')}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className={FIELD_LABEL_CLASS} htmlFor="notes">
                                    Notes for the shop
                                </Label>
                                <Textarea
                                    id="notes"
                                    rows={4}
                                    className={TEXTAREA_CLASS}
                                    {...form.register('notes')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-1 border-neutral-700 bg-neutral-900 text-neutral-100 xl:mt-auto">
                        <CardContent className="space-y-4 pt-6">
                            {serverError ? (
                                <p className="text-sm text-red-400">{serverError}</p>
                            ) : null}
                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? 'Creating booking…'
                                        : 'Create Booking'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
