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
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                Additional Notes
            </h2>
            <Textarea
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                placeholder="Optional booking notes"
                className="border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
            />
        </section>
    )
}
