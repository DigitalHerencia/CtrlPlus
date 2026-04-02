import type { ReactNode } from 'react'

interface CatalogToolbarProps {
    children: ReactNode
}

export function CatalogToolbar({ children }: CatalogToolbarProps) {
    return <div className="space-y-3">{children}</div>
}
