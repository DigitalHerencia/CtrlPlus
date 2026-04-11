/**
 * @introduction Components — TODO: short one-line summary of wrap-image-list.tsx
 *
 * @description TODO: longer description for wrap-image-list.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapImageListProps {
    children: ReactNode
}

/**
 * WrapImageList — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapImageList({ children }: WrapImageListProps) {
    return <div className="grid grid-cols-3 gap-4">{children}</div>
}
