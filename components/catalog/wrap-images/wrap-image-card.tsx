/**
 * @introduction Components — TODO: short one-line summary of wrap-image-card.tsx
 *
 * @description TODO: longer description for wrap-image-card.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapImageCardProps {
    children: ReactNode
}

/**
 * WrapImageCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapImageCard({ children }: WrapImageCardProps) {
    return (
        <div className="space-y-2 rounded-md border border-neutral-800 bg-neutral-950 p-2">
            {children}
        </div>
    )
}
