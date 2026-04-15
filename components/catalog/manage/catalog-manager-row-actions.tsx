
import type { ReactNode } from 'react'

interface CatalogManagerRowActionsProps {
    children: ReactNode
}


export function CatalogManagerRowActions({ children }: CatalogManagerRowActionsProps) {
    return <div className="flex items-center gap-2">{children}</div>
}
