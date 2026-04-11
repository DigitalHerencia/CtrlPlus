/**
 * @introduction Components — TODO: short one-line summary of wrap-details-fields.tsx
 *
 * @description TODO: longer description for wrap-details-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapDetailsFieldsProps {
    children: ReactNode
}

/**
 * WrapDetailsFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapDetailsFields({ children }: WrapDetailsFieldsProps) {
    return <div className="space-y-2">{children}</div>
}
