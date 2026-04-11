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
        <section className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-100">Date & Time</h3>
            {calendar}
            {slotPicker}
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
        </section>
    )
}
