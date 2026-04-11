/**
 * @introduction Components — TODO: short one-line summary of invoice-form-fields.tsx
 *
 * @description TODO: longer description for invoice-form-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InvoiceFormFieldsProps {
    bookingId: string
    onBookingIdChange: (value: string) => void
}

/**
 * InvoiceFormFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceFormFields({ bookingId, onBookingIdChange }: InvoiceFormFieldsProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="booking-id">Booking ID</Label>
            <Input
                id="booking-id"
                value={bookingId}
                onChange={(event) => onBookingIdChange(event.target.value)}
                placeholder="booking_xxx"
            />
        </div>
    )
}
