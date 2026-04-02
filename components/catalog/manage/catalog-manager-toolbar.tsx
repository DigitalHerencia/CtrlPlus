import type { ReactNode } from 'react'

import { CatalogToolbar } from '@/components/catalog/catalog-toolbar'

interface CatalogManagerToolbarProps {
    children: ReactNode
}

export function CatalogManagerToolbar({ children }: CatalogManagerToolbarProps) {
    return <CatalogToolbar>{children}</CatalogToolbar>
}
