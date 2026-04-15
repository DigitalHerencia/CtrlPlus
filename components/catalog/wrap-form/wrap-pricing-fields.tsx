
import type { ReactNode } from 'react'

interface WrapPricingFieldsProps {
    children: ReactNode
}


export function WrapPricingFields({ children }: WrapPricingFieldsProps) {
    return <div className="grid grid-cols-2 gap-4">{children}</div>
}
