'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import Image from 'next/image'
import Link from 'next/link'
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
import type { BookingDraftDTO } from '@/types/scheduling.types'
import type { UserSettingsViewDTO } from '@/types/settings.types'

import { BookingCalendarClient } from './booking-calendar.client'
import { BookingSlotPickerClient } from './booking-slot-picker.client'

interface SchedulingBookingFormClientProps {
    availabilityWindows: Array<{ id: string; dayOfWeek: number; startTime: string; endTime: string; capacity: number }>
    draft: BookingDraftDTO
    initialSettings: UserSettingsViewDTO
    minDate?: Date
}

type BookingFormValues = z.infer<typeof bookingFormSchema>

function buildDateTime(date: Date, time: string): Date {
    const [hourPart, minutePart = '0'] = time.split(':')
    const nextDate = new Date(date)
    nextDate.setHours(Number(hourPart), Number(minutePart), 0, 0)
    return nextDate
}

function formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInCents / 100)
}

/**
 * SchedulingBookingFormClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingBookingFormClient({
    availabilityWindows,
    draft,
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
            vehicleMake: draft.vehicleMake ?? initialSettings.vehicleMake ?? '',
            vehicleModel: draft.vehicleModel ?? initialSettings.vehicleModel ?? '',
            vehicleYear: draft.vehicleYear ?? initialSettings.vehicleYear ?? '',
            vehicleTrim: draft.vehicleTrim ?? initialSettings.vehicleTrim ?? '',
            previewImageUrl: draft.previewImageUrl ?? '',
            previewPromptUsed: draft.previewPromptUsed ?? '',
            notes: '',
        },
    })

    const selectedDate = (useWatch({ control: form.control, name: 'date' }) ?? null) as Date | null
    const selectedWindowId = useWatch({ control: form.control, name: 'windowId' }) ?? ''

    const availableWeekdays = useMemo(() => [...new Set(availabilityWindows.map((window) => window.dayOfWeek))], [availabilityWindows])
    const windowsForDate = useMemo(() => {
        if (!selectedDate) {
            return []
        }
        return availabilityWindows.filter((window) => window.dayOfWeek === selectedDate.getDay())
    }, [availabilityWindows, selectedDate])

    const handleSubmit = form.handleSubmit(async (values) => {
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
                wrapId: draft.wrapId,
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
                previewImageUrl: values.previewImageUrl,
                previewPromptUsed: values.previewPromptUsed,
                notes: values.notes,
            })

            router.push(`/scheduling/${booking.id}`)
            router.refresh()
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Failed to create booking.')
        }
    })

    return (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-6">
                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-base">Choose Drop-off Window</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <BookingCalendarClient
                            availableWeekdays={availableWeekdays}
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                                form.setValue('date', date, { shouldValidate: true })
                                form.setValue('windowId', '', { shouldValidate: true })
                            }}
                            minDate={minDate}
                        />
                        <div className="space-y-3">
                            <BookingSlotPickerClient
                                slots={windowsForDate}
                                selectedSlotId={selectedWindowId}
                                onSelectSlot={(slotId) => form.setValue('windowId', slotId, { shouldValidate: true })}
                                disabled={form.formState.isSubmitting}
                            />
                            {form.formState.errors.windowId?.message ? <p className="text-sm text-red-400">{form.formState.errors.windowId.message}</p> : null}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader><CardTitle className="text-base">Contact Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="customerName">Full name</Label><Input id="customerName" {...form.register('customerName')} /></div>
                        <div className="space-y-2"><Label htmlFor="customerEmail">Email</Label><Input id="customerEmail" type="email" {...form.register('customerEmail')} /></div>
                        <div className="space-y-2"><Label htmlFor="customerPhone">Phone</Label><Input id="customerPhone" {...form.register('customerPhone')} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="preferredContact">Preferred notification channel</Label><select id="preferredContact" className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3" {...form.register('preferredContact')}><option value="email">Email</option><option value="sms">SMS</option></select></div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader><CardTitle className="text-base">Billing Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="billingAddressLine1">Billing address</Label><Input id="billingAddressLine1" {...form.register('billingAddressLine1')} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="billingAddressLine2">Address line 2</Label><Input id="billingAddressLine2" {...form.register('billingAddressLine2')} /></div>
                        <div className="space-y-2"><Label htmlFor="billingCity">City</Label><Input id="billingCity" {...form.register('billingCity')} /></div>
                        <div className="space-y-2"><Label htmlFor="billingState">State</Label><Input id="billingState" {...form.register('billingState')} /></div>
                        <div className="space-y-2"><Label htmlFor="billingPostalCode">Postal code</Label><Input id="billingPostalCode" {...form.register('billingPostalCode')} /></div>
                        <div className="space-y-2"><Label htmlFor="billingCountry">Country</Label><Input id="billingCountry" {...form.register('billingCountry')} /></div>
                        <div className="space-y-2 md:col-span-2 rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-300">
                            {initialSettings.stripeDefaultPaymentMethodLast4 ? (
                                <p>Saved payment method on file: {initialSettings.stripeDefaultPaymentMethodBrand ?? 'Card'} ending in {initialSettings.stripeDefaultPaymentMethodLast4}. You will pay after the owner issues the invoice.</p>
                            ) : (
                                <p>No default payment method is saved yet. You can still request booking now and add payment details when the invoice is issued.</p>
                            )}
                            <Button asChild type="button" variant="link" className="mt-2 h-auto p-0 text-blue-300">
                                <Link href="/settings/account">Manage payment settings</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader><CardTitle className="text-base">Vehicle Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2"><Label htmlFor="vehicleMake">Make</Label><Input id="vehicleMake" {...form.register('vehicleMake')} /></div>
                        <div className="space-y-2"><Label htmlFor="vehicleModel">Model</Label><Input id="vehicleModel" {...form.register('vehicleModel')} /></div>
                        <div className="space-y-2"><Label htmlFor="vehicleYear">Year</Label><Input id="vehicleYear" {...form.register('vehicleYear')} /></div>
                        <div className="space-y-2"><Label htmlFor="vehicleTrim">Trim</Label><Input id="vehicleTrim" {...form.register('vehicleTrim')} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="notes">Notes for the shop</Label><Textarea id="notes" rows={4} {...form.register('notes')} /></div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader><CardTitle className="text-base">Selected Wrap</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-lg font-semibold">{draft.wrapNameSnapshot}</p>
                                <p className="text-sm text-neutral-400">This selection follows you from catalog through preview and scheduling.</p>
                            </div>
                            <p className="text-sm font-medium text-neutral-200">{formatPrice(draft.wrapPriceSnapshot)}</p>
                        </div>
                        {draft.previewImageUrl ? (
                            <Image src={draft.previewImageUrl} alt="Wrap preview" width={1200} height={675} className="w-full rounded-lg border border-neutral-800 object-cover" />
                        ) : (
                            <div className="rounded-lg border border-dashed border-neutral-800 p-6 text-sm text-neutral-400">No generated preview yet. You can still continue, or go back to the visualizer first.</div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <Button asChild type="button" variant="outline"><Link href="/visualizer">Edit preview</Link></Button>
                            <Button asChild type="button" variant="outline"><Link href="/settings/profile">Review defaults</Link></Button>
                        </div>
                    </CardContent>
                </Card>

                {serverError ? <p className="text-sm text-red-400">{serverError}</p> : null}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting request…' : 'Submit Booking Request'}
                </Button>
            </div>
        </form>
    )
}

