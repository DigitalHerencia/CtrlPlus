import Link from 'next/link'

import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { Button } from '@/components/ui/button'
import { getCatalogManagerWraps, getWrapCategories } from '@/lib/fetchers/catalog.fetchers'
import { createCatalogQueryString } from '@/lib/utils/search-params'
import type { CatalogManagerPageFeatureProps } from '@/types/catalog.types'
import { CatalogFiltersClient } from './catalog-filters-client'
import { CatalogManagerClient } from './catalog-manager-client'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'

export async function CatalogManagerPageFeature({ filters }: CatalogManagerPageFeatureProps) {
    const [data, categories] = await Promise.all([
        getCatalogManagerWraps(filters, { includeHidden: true }),
        getWrapCategories(),
    ])

    return (
        <div className="space-y-6">
            <CatalogManagerHeader />
            <WorkspacePageContextCard
                title="Manager Controls"
                description="Inventory oversight and storefront navigation"
            >
                <div className="mr-4 text-left lg:text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Managed Wraps</p>
                    <p className="text-3xl font-black text-neutral-100">{data.total}</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/catalog">Back to Gallery</Link>
                </Button>
            </WorkspacePageContextCard>
            <CatalogFiltersClient categories={categories} />
            <CatalogManagerClient wraps={data.wraps} categories={categories} />
            <CatalogPagination
                page={data.page}
                totalPages={data.totalPages}
                createPageHref={(page) => {
                    const query = createCatalogQueryString({ ...filters, page })
                    return query ? `/catalog/manage?${query}` : '/catalog/manage'
                }}
            />
        </div>
    )
}
