/**
 * @introduction Components — TODO: short one-line summary of booking-notes-fields.tsx
 *
 * @description TODO: longer description for booking-notes-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Textarea } from '@/components/ui/textarea'

interface BookingNotesFieldsProps {
    notes: string
    onNotesChange: (value: string) => void
}

/**
 * BookingNotesFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingNotesFields({ notes, onNotesChange }: BookingNotesFieldsProps) {
    return (
        <section className="space-y-3 md:col-span-2">
            <h3 className="text-sm font-semibold text-neutral-100">Notes</h3>
            <Textarea
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                placeholder="Optional booking notes"
            />
        </section>
    )
}
