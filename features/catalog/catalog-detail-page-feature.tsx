import { notFound } from 'next/navigation'

import { WrapDetail } from '@/components/catalog/WrapDetail'
import { getCatalogWrapById, isExampleCatalogWrapId } from '@/lib/fetchers/catalog.fetchers'
import { type CatalogDetailPageFeatureProps } from '@/types/catalog'

import { CatalogWrapAssetsClient } from './catalog-wrap-assets-client'

export async function CatalogDetailPageFeature({
    wrapId,
    canManageCatalog,
}: CatalogDetailPageFeatureProps) {
    const wrap = await getCatalogWrapById(wrapId, { includeHidden: canManageCatalog })

    if (!wrap) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <WrapDetail wrap={wrap} canManageCatalog={canManageCatalog} />
            {canManageCatalog && !isExampleCatalogWrapId(wrap.id) ? (
                <CatalogWrapAssetsClient wrap={wrap} />
            ) : null}
        </div>
    )
}
