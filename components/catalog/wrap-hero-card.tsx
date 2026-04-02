import type { CatalogBrowseCardDTO } from '@/types/catalog.types'

import { WrapGalleryCard } from './wrap-gallery-card'

interface WrapHeroCardProps {
    wrap: CatalogBrowseCardDTO
}

export function WrapHeroCard({ wrap }: WrapHeroCardProps) {
    return <WrapGalleryCard wrap={wrap} />
}
