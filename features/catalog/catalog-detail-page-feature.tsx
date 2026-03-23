import { notFound } from 'next/navigation'

import { WrapDetail } from '@/components/catalog/WrapDetail'
import { getCatalogWrapById } from '@/lib/catalog/fetchers/get-wraps'
import { isExampleCatalogWrapId } from '@/lib/catalog/fetchers/example-wraps'

import { CatalogWrapAssetsClient } from './catalog-wrap-assets-client'

interface CatalogDetailPageFeatureProps {
    wrapId: string
    canManageCatalog: boolean
}

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
