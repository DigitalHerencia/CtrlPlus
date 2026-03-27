'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    type BookingFormAvailabilityWindow,
    type BookingFormProps,
} from '@/types/scheduling'

import { CalendarClient } from './calendar-client'
import { TimeSlot } from './time-slot'

function getAvailableWeekdays(windows: BookingFormAvailabilityWindow[]): number[] {
    return [...new Set(windows.map((window) => window.dayOfWeek))]
}

function getWindowsForDate(
    windows: BookingFormAvailabilityWindow[],
    date: Date
): BookingFormAvailabilityWindow[] {
    return windows.filter((window) => window.dayOfWeek === date.getDay())
}

function formatSelectedDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

function formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(priceInCents / 100)
}

export function BookingForm({
    availabilityWindows,
    wraps,
    selectedDate,
    selectedWindowId,
    selectedWrapId,
    errors,
    isPending = false,
    minDate,
    onSubmit,
    onDateSelect,
    onWindowSelect,
    onWrapSelect,
}: BookingFormProps) {
    const availableWeekdays = getAvailableWeekdays(availabilityWindows)
    const windowsForSelectedDate = selectedDate
        ? getWindowsForDate(availabilityWindows, selectedDate)
        : []

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2" noValidate>
            <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-base">Select a Date</CardTitle>
                    <CardDescription>Highlighted days have available time slots.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <CalendarClient
                        availableWeekdays={availableWeekdays}
                        selectedDate={selectedDate}
                        onDateSelect={onDateSelect}
                        minDate={minDate}
                    />
                </CardContent>
            </Card>

            <div className="space-y-4">
                {selectedDate ? (
                    <>
                        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Available Times for {formatSelectedDate(selectedDate)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {windowsForSelectedDate.length === 0 ? (
                                    <p className="text-sm text-neutral-500">
                                        No time slots available for this day.
                                    </p>
                                ) : (
                                    windowsForSelectedDate.map((window) => (
                                        <TimeSlot
                                            key={window.id}
                                            startTime={window.startTime}
                                            endTime={window.endTime}
                                            capacity={window.capacity}
                                            isSelected={selectedWindowId === window.id}
                                            onClick={() => onWindowSelect(window.id)}
                                            disabled={isPending}
                                        />
                                    ))
                                )}
                                {errors?.windowId ? (
                                    <span className="text-xs text-red-500">
                                        {errors.windowId}
                                    </span>
                                ) : null}
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                            <CardHeader>
                                <CardTitle className="text-base">Select a Wrap</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {wraps.length === 0 ? (
                                    <p className="text-sm text-neutral-500">
                                        No wrap services are available for booking at this time.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {wraps.map((wrap) => (
                                            <button
                                                key={wrap.id}
                                                type="button"
                                                className={`w-full border px-4 py-3 text-left transition-colors ${
                                                    selectedWrapId === wrap.id
                                                        ? 'border-blue-600 bg-neutral-900 text-neutral-100'
                                                        : 'border-neutral-700 bg-neutral-900 text-neutral-100 hover:border-blue-600'
                                                }`}
                                                onClick={() => onWrapSelect(wrap.id)}
                                                aria-pressed={selectedWrapId === wrap.id}
                                                disabled={isPending}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-sm font-medium">
                                                        {wrap.name}
                                                    </span>
                                                    <span className="text-sm text-neutral-300">
                                                        {formatPrice(wrap.price)}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {errors?.wrapId ? (
                                    <span className="mt-2 block text-xs text-red-500">
                                        {errors.wrapId}
                                    </span>
                                ) : null}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                        <CardContent className="py-12 text-center text-sm text-neutral-100">
                            Select a date to see available time slots.
                        </CardContent>
                    </Card>
                )}

                {errors?.date ? <p className="text-sm text-red-400">{errors.date}</p> : null}
                {errors?.root ? <p className="text-sm text-red-400">{errors.root}</p> : null}

                <Button
                    type="submit"
                    disabled={isPending || wraps.length === 0 || availabilityWindows.length === 0}
                    className="w-full"
                >
                    {isPending ? 'Booking…' : 'Confirm Booking'}
                </Button>
            </div>
        </form>
    )
}
