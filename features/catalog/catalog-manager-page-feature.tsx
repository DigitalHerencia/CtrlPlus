import { CatalogPagination } from '@/components/catalog/catalog-pagination'
import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { getCatalogManagerWraps, getWrapCategories } from '@/lib/fetchers/catalog.fetchers'
import { createCatalogQueryString } from '@/lib/utils/search-params'
import type { CatalogManagerPageFeatureProps } from '@/types/catalog.types'
import { CatalogManagerClient } from './catalog-manager-client'

export async function CatalogManagerPageFeature({ filters }: CatalogManagerPageFeatureProps) {
    const [data, categories] = await Promise.all([
        getCatalogManagerWraps(filters, { includeHidden: true }),
        getWrapCategories(),
    ])

    return (
        <div className="space-y-6">
            <CatalogManagerHeader />
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
