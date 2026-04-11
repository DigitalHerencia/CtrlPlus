/**
 * @introduction Components — TODO: short one-line summary of booking-form-fields.tsx
 *
 * @description TODO: longer description for booking-form-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface BookingFormFieldsProps {
    children: ReactNode
}

/**
 * BookingFormFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingFormFields({ children }: BookingFormFieldsProps) {
    return <div className="grid gap-4 md:grid-cols-2">{children}</div>
}
