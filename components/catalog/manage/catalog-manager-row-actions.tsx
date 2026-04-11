/**
 * @introduction Components — TODO: short one-line summary of catalog-manager-row-actions.tsx
 *
 * @description TODO: longer description for catalog-manager-row-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface CatalogManagerRowActionsProps {
    children: ReactNode
}

/**
 * CatalogManagerRowActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CatalogManagerRowActions({ children }: CatalogManagerRowActionsProps) {
    return <div className="flex items-center gap-2">{children}</div>
}
