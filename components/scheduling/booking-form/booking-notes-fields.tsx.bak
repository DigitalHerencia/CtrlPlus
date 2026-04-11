import { Textarea } from '@/components/ui/textarea'

interface BookingNotesFieldsProps {
    notes: string
    onNotesChange: (value: string) => void
}

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
