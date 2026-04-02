import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InvoiceFormFieldsProps {
    bookingId: string
    onBookingIdChange: (value: string) => void
}

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
