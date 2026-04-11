/**
 * @introduction Components — TODO: short one-line summary of wrap-gallery-manager.tsx
 *
 * @description TODO: longer description for wrap-gallery-manager.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface WrapGalleryManagerProps {
    children: ReactNode
}

/**
 * WrapGalleryManager — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapGalleryManager({ children }: WrapGalleryManagerProps) {
    return <div className="space-y-3">{children}</div>
}
