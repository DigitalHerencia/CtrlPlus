
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InvoiceFormFieldsProps {
    bookingId: string
    description: string
    unitPrice?: number
    quantity?: number
    onBookingIdChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onUnitPriceChange: (value: number) => void
    onQuantityChange: (value: number) => void
}


export function InvoiceFormFields({
    bookingId,
    description,
    unitPrice,
    quantity,
    onBookingIdChange,
    onDescriptionChange,
    onUnitPriceChange,
    onQuantityChange,
}: InvoiceFormFieldsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="booking-id">Booking ID</Label>
                <Input
                    id="booking-id"
                    value={bookingId}
                    onChange={(event) => onBookingIdChange(event.target.value)}
                    placeholder="booking_xxx"
                />
            </div>
            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="invoice-description">Description</Label>
                <Input
                    id="invoice-description"
                    value={description}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    placeholder="Consultation or install services"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="invoice-unit-price">Unit Price (cents)</Label>
                <Input
                    id="invoice-unit-price"
                    type="number"
                    min={1}
                    step={1}
                    value={unitPrice ?? ''}
                    onChange={(event) => onUnitPriceChange(Number(event.target.value))}
                    placeholder="25000"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="invoice-quantity">Quantity</Label>
                <Input
                    id="invoice-quantity"
                    type="number"
                    min={1}
                    step={1}
                    value={quantity ?? 1}
                    onChange={(event) => onQuantityChange(Number(event.target.value))}
                    placeholder="1"
                />
            </div>
        </div>
    )
}
