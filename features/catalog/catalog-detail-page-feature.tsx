import { notFound } from 'next/navigation'

import { WrapDetail } from '@/components/catalog/WrapDetail'
import { getCatalogWrapById, isExampleCatalogWrapId } from '@/lib/fetchers/catalog.fetchers'
import type { CatalogDetailPageFeatureProps, WrapDetailPageParams } from '@/types/catalog.types'

import { CatalogWrapAssetsClient } from './catalog-wrap-assets-client'

export async function generateCatalogWrapMetadata(params: WrapDetailPageParams['params']) {
    const { wrapId } = await params
    const wrap = await getCatalogWrapById(wrapId, { includeHidden: false })

    if (!wrap) {
        return { title: 'Wrap Not Found' }
    }

    return {
        title: wrap.name,
        description: wrap.description ?? undefined,
        openGraph: {
            title: wrap.name,
            description: wrap.description ?? undefined,
            images: wrap.heroImage ? [wrap.heroImage.detailUrl] : undefined,
        },
    }
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
