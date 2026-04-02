import type { CatalogBrowseCardDTO } from '@/types/catalog.types'
import { WrapGalleryGrid } from './wrap-gallery-grid'

interface WrapGridProps {
    wraps: CatalogBrowseCardDTO[]
    canManageCatalog?: boolean
}

export function WrapGrid({ wraps, canManageCatalog = false }: WrapGridProps) {
    return <WrapGalleryGrid wraps={wraps} canManageCatalog={canManageCatalog} />
}
