/**
 * @introduction Components — TODO: short one-line summary of wrap-form-fields.tsx
 *
 * @description TODO: longer description for wrap-form-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapFormFieldsProps {
    children: ReactNode
}

/**
 * WrapFormFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapFormFields({ children }: WrapFormFieldsProps) {
    return <div className="space-y-6">{children}</div>
}
