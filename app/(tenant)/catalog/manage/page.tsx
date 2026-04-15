import { CatalogManagerRouteFeature } from '@/features/catalog/catalog-manager-route-feature'
import type { CatalogPageSearchParams } from '@/types/catalog.types'

export default async function CatalogManagerPage({ searchParams }: CatalogPageSearchParams) {
    return <CatalogManagerRouteFeature searchParams={searchParams} />
}
