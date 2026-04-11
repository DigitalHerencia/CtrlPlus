/**
 * @introduction Components — TODO: short one-line summary of wrap-pricing-fields.tsx
 *
 * @description TODO: longer description for wrap-pricing-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapPricingFieldsProps {
    children: ReactNode
}

/**
 * WrapPricingFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapPricingFields({ children }: WrapPricingFieldsProps) {
    return <div className="grid grid-cols-2 gap-4">{children}</div>
}
