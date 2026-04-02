import type { ReactNode } from 'react'

interface CatalogFilterBarProps {
    children: ReactNode
}

export function CatalogFilterBar({ children }: CatalogFilterBarProps) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{children}</div>
        </div>
    )
}
