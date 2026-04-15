'use client'


import { Button } from '@/components/ui/button'
import {
    type BookingFormAvailabilityWindow,
    type BookingFormProps,
} from '@/types/scheduling.client.types'

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
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8" noValidate>
            {errors?.root ? (
                <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                    {errors.root}
                </div>
            ) : null}

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                    Select a Date
                </h2>
                <p className="text-sm text-neutral-400">
                    Highlighted days have available time slots.
                </p>
                <div className="flex justify-center">
                    <CalendarClient
                        availableWeekdays={availableWeekdays}
                        selectedDate={selectedDate}
                        onDateSelect={onDateSelect}
                        minDate={minDate}
                    />
                </div>
                {errors?.date ? <p className="text-sm text-red-400">{errors.date}</p> : null}
            </div>

            {selectedDate ? (
                <>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                            Available Times for {formatSelectedDate(selectedDate)}
                        </h2>
                        {windowsForSelectedDate.length === 0 ? (
                            <p className="text-sm text-neutral-500">
                                No time slots available for this day.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {windowsForSelectedDate.map((window) => (
                                    <TimeSlot
                                        key={window.id}
                                        startTime={window.startTime}
                                        endTime={window.endTime}
                                        capacity={window.capacity}
                                        isSelected={selectedWindowId === window.id}
                                        onClick={() => onWindowSelect(window.id)}
                                        disabled={isPending}
                                    />
                                ))}
                            </div>
                        )}
                        {errors?.windowId ? (
                            <p className="text-sm text-red-400">{errors.windowId}</p>
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                            Select a Service
                        </h2>
                        {wraps.length === 0 ? (
                            <p className="text-sm text-neutral-500">
                                No wrap services are available for booking at this time.
                            </p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {wraps.map((wrap) => (
                                    <label
                                        key={wrap.id}
                                        className={
                                            selectedWrapId === wrap.id
                                                ? 'cursor-pointer rounded-2xl border border-blue-600 bg-blue-950/20 p-4'
                                                : 'cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 transition hover:border-neutral-700'
                                        }
                                    >
                                        <input
                                            aria-label={wrap.name}
                                            type="radio"
                                            className="sr-only"
                                            disabled={isPending}
                                            value={wrap.id}
                                            checked={selectedWrapId === wrap.id}
                                            onChange={() => onWrapSelect(wrap.id)}
                                        />
                                        <p className="text-sm font-medium text-neutral-50">
                                            {wrap.name}
                                        </p>
                                        <p className="mt-2 text-sm text-neutral-400">
                                            {formatPrice(wrap.price)}
                                        </p>
                                    </label>
                                ))}
                            </div>
                        )}
                        {errors?.wrapId ? (
                            <p className="text-sm text-red-400">{errors.wrapId}</p>
                        ) : null}
                    </div>
                </>
            ) : null}

            <Button
                type="submit"
                disabled={isPending || wraps.length === 0 || availabilityWindows.length === 0}
                className="h-12 w-full bg-neutral-100 font-medium text-neutral-950 hover:bg-white sm:w-auto"
            >
                {isPending ? 'Booking…' : 'Confirm Booking'}
            </Button>
        </form>
    )
}
