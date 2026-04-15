import { WrapManagerDetailRouteFeature } from '@/features/catalog/manage/wrap-manager-detail-route-feature'
import type { WrapDetailPageParams } from '@/types/catalog.types'

export { wrapManagerDetailRouteMetadata as metadata } from '@/features/catalog/manage/wrap-manager-detail-route-feature'

export default async function WrapManagerPage({ params }: WrapDetailPageParams) {
    return <WrapManagerDetailRouteFeature params={params} />
}
