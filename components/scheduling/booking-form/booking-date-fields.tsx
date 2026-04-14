/**
 * @introduction Components — TODO: short one-line summary of booking-date-fields.tsx
 *
 * @description TODO: longer description for booking-date-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface BookingDateFieldsProps {
    calendar: ReactNode
    slotPicker: ReactNode
    error?: string
}

/**
 * BookingDateFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingDateFields({ calendar, slotPicker, error }: BookingDateFieldsProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">Date & Time</h2>
            <div className="space-y-4">
                {calendar}
                {slotPicker}
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </section>
    )
}
