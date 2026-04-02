import Link from 'next/link'

import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { Button } from '@/components/ui/button'
import { getCatalogManagerWraps, getWrapCategories } from '@/lib/fetchers/catalog.fetchers'
import { createCatalogQueryString } from '@/lib/utils/search-params'
import type { CatalogManagerPageFeatureProps } from '@/types/catalog.types'
import { CatalogFiltersClient } from './catalog-filters-client'
import { CatalogManagerClient } from './catalog-manager-client'

export async function CatalogManagerPageFeature({ filters }: CatalogManagerPageFeatureProps) {
    const [data, categories] = await Promise.all([
        getCatalogManagerWraps(filters, { includeHidden: true }),
        getWrapCategories(),
    ])

    return (
        <div className="space-y-6">
            <CatalogManagerHeader
                total={data.total}
                actions={
                    <Button asChild variant="outline">
                        <Link href="/catalog">Back to Gallery</Link>
                    </Button>
                }
            />
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
