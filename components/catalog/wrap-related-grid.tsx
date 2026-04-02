import type { CatalogBrowseCardDTO } from '@/types/catalog.types'

import { WrapGalleryGrid } from './wrap-gallery-grid'

interface WrapRelatedGridProps {
    wraps: CatalogBrowseCardDTO[]
}

export function WrapRelatedGrid({ wraps }: WrapRelatedGridProps) {
    return <WrapGalleryGrid wraps={wraps} canManageCatalog={false} />
}
