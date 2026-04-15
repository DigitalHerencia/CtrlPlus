
import type { ReactNode } from 'react'

interface BookingFormFieldsProps {
    children: ReactNode
}


export function BookingFormFields({ children }: BookingFormFieldsProps) {
    return <div className="space-y-8">{children}</div>
}
