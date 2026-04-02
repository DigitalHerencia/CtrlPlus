import type { ReactNode } from 'react'

interface BookingDateFieldsProps {
    calendar: ReactNode
    slotPicker: ReactNode
    error?: string
}

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
