import Link from 'next/link'
import { cache } from 'react'

import { CatalogPagination } from '@/components/catalog/catalog-pagination'
import { WrapGalleryGrid } from '@/components/catalog/wrap-gallery-grid'
import { Button } from '@/components/ui/button'
import { getWrapCategories, searchCatalogWraps } from '@/lib/fetchers/catalog.fetchers'
import { createCatalogPageHref } from '@/lib/utils/search-params'
import type { SearchWrapsInput } from '@/types/catalog.types'

import { CatalogFiltersClient } from './catalog-filters-client'

const getCatalogBrowseData = cache(async (filters: SearchWrapsInput) =>
    searchCatalogWraps(filters)
)

const getCatalogCategories = cache(async () => getWrapCategories())

interface CatalogBrowseRegionProps {
    filters: SearchWrapsInput
    canManageCatalog: boolean
}

export async function CatalogResultsSummary({
    filters,
}: CatalogBrowseRegionProps) {
    const data = await getCatalogBrowseData(filters)

    return (
        <div className="text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Results</p>
            <p className="text-3xl font-black text-neutral-100">{data.total}</p>
        </div>
    )
}

export async function CatalogFiltersSection() {
    const categories = await getCatalogCategories()
    return <CatalogFiltersClient categories={categories} />
}

export async function CatalogResultsSection({
    filters,
    canManageCatalog,
}: CatalogBrowseRegionProps) {
    const data = await getCatalogBrowseData(filters)

    return (
        <div className="space-y-6">
            {canManageCatalog ? (
                <div className="flex justify-end">
                    <Button asChild>
                        <Link href="/catalog/manage">Open Catalog Manager</Link>
                    </Button>
                </div>
            ) : null}
            <WrapGalleryGrid wraps={data.wraps} canManageCatalog={canManageCatalog} />
            <CatalogPagination
                page={data.page}
                totalPages={data.totalPages}
                createPageHref={(page) => createCatalogPageHref(filters, page)}
            />
        </div>
    )
}
