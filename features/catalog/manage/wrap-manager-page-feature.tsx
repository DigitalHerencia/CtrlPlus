import { CatalogManagerPageFeature } from '@/features/catalog/catalog-manager-page-feature'
import type { CatalogManagerPageFeatureProps } from '@/types/catalog.types'

export async function WrapManagerPageFeature(props: CatalogManagerPageFeatureProps) {
    return <CatalogManagerPageFeature {...props} />
}
