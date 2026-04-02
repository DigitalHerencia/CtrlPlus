import Link from 'next/link'

import { WorkspaceEmptyState } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import type { CatalogBrowseCardDTO } from '@/types/catalog.types'

import { WrapGalleryCard } from './wrap-gallery-card'

interface WrapGalleryGridProps {
    wraps: CatalogBrowseCardDTO[]
    canManageCatalog?: boolean
}

export function WrapGalleryGrid({ wraps, canManageCatalog = false }: WrapGalleryGridProps) {
    if (wraps.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No wraps match this view"
                description={
                    canManageCatalog
                        ? 'Refine your search or create a new wrap to keep the catalog moving.'
                        : 'Try a different search, category, or price range.'
                }
                action={
                    canManageCatalog ? (
                        <Button asChild>
                            <Link href="/catalog/manage">Open Catalog Manager</Link>
                        </Button>
                    ) : undefined
                }
            />
        )
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {wraps.map((wrap) => (
                <WrapGalleryCard key={wrap.id} wrap={wrap} />
            ))}
        </div>
    )
}
