import { CatalogDetailRouteFeature } from '@/features/catalog/catalog-detail-route-feature'
import type { WrapDetailPageParams } from '@/types/catalog.types'

export { generateCatalogDetailRouteMetadata as generateMetadata } from '@/features/catalog/catalog-detail-route-feature'

export default async function WrapDetailPage({ params }: WrapDetailPageParams) {
    return <CatalogDetailRouteFeature params={params} />
}
