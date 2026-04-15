
import type { ReactNode } from 'react'

interface BookingDateFieldsProps {
    calendar: ReactNode
    slotPicker: ReactNode
    error?: string
}


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
