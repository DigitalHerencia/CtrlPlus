import Link from 'next/link'

import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { WrapGrid } from '@/components/catalog/WrapGrid'
import { getWrapCategories, searchCatalogWraps } from '@/lib/fetchers/catalog.fetchers'
import { createCatalogPageHref } from '@/lib/catalog/search-params'
import type { CatalogBrowsePageFeatureProps } from '@/types/catalog/route-types'
import { CatalogFiltersClient } from './catalog-filters-client'

export async function CatalogBrowsePageFeature({
    filters,
    canManageCatalog,
}: CatalogBrowsePageFeatureProps) {
    const [data, categories] = await Promise.all([
        searchCatalogWraps(filters, { includeHidden: canManageCatalog }),
        getWrapCategories(),
    ])

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Catalog"
                title="Vehicle Wrap Gallery"
                description="Browse professionally managed wrap packages with deterministic product imagery, category filtering, and direct detail access."
                actions={
                    canManageCatalog ? (
                        <Button asChild>
                            <Link href="/catalog/manage">Open Catalog Manager</Link>
                        </Button>
                    ) : undefined
                }
                detail={
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                            Results
                        </p>
                        <p className="text-3xl font-black text-neutral-100">{data.total}</p>
                    </div>
                }
            />
            <CatalogFiltersClient categories={categories} />
            <WrapGrid wraps={data.wraps} canManageCatalog={canManageCatalog} />
            <CatalogPagination
                page={data.page}
                totalPages={data.totalPages}
                createPageHref={(page) => createCatalogPageHref(filters, page)}
            />
        </div>
    )
}
