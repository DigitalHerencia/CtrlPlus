import type { ReactNode } from 'react'

interface CatalogManagerTableProps {
    children: ReactNode
}

export function CatalogManagerTable({ children }: CatalogManagerTableProps) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 p-3">{children}</div>
    )
}
