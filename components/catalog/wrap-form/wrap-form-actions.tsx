/**
 * @introduction Components — TODO: short one-line summary of wrap-form-actions.tsx
 *
 * @description TODO: longer description for wrap-form-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapFormActionsProps {
    children: ReactNode
}

/**
 * WrapFormActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapFormActions({ children }: WrapFormActionsProps) {
    return <div className="flex gap-2">{children}</div>
}
