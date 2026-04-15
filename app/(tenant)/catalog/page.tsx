import { CatalogBrowseRouteFeature } from '@/features/catalog/catalog-browse-route-feature'
import type { CatalogPageSearchParams } from '@/types/catalog.types'

export default async function CatalogPage({ searchParams }: CatalogPageSearchParams) {
    return <CatalogBrowseRouteFeature searchParams={searchParams} />
}
