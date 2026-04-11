/**
 * @introduction Components — TODO: short one-line summary of booking-contact-fields.tsx
 *
 * @description TODO: longer description for booking-contact-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'

interface BookingContactFieldsProps {
    customerName: string
    customerEmail: string
    customerPhone: string
    onCustomerNameChange: (value: string) => void
    onCustomerEmailChange: (value: string) => void
    onCustomerPhoneChange: (value: string) => void
}

/**
 * BookingContactFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingContactFields({
    customerName,
    customerEmail,
    customerPhone,
    onCustomerNameChange,
    onCustomerEmailChange,
    onCustomerPhoneChange,
}: BookingContactFieldsProps) {
    return (
        <section className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-100">Customer Details</h3>
            <Input
                value={customerName}
                onChange={(event) => onCustomerNameChange(event.target.value)}
                placeholder="Customer name"
            />
            <Input
                value={customerEmail}
                onChange={(event) => onCustomerEmailChange(event.target.value)}
                placeholder="Customer email"
                type="email"
            />
            <Input
                value={customerPhone}
                onChange={(event) => onCustomerPhoneChange(event.target.value)}
                placeholder="Customer phone"
            />
        </section>
    )
}
