import { CatalogManagerPageView } from '@/components/catalog/manage/catalog-manager-page-view'
import { getCatalogManagerWraps, getWrapCategories } from '@/lib/fetchers/catalog.fetchers'
import { createCatalogQueryString } from '@/lib/utils/search-params'
import type { CatalogManagerPageFeatureProps } from '@/types/catalog.types'

export async function CatalogManagerPageFeature({ filters }: CatalogManagerPageFeatureProps) {
    const [data, categories] = await Promise.all([
        getCatalogManagerWraps(filters, { includeHidden: true }),
        getWrapCategories(),
    ])

    return (
        <CatalogManagerPageView
            wraps={data.wraps}
            categories={categories}
            page={data.page}
            totalPages={data.totalPages}
            createPageHref={(page) => {
                const query = createCatalogQueryString({ ...filters, page })
                return query ? `/catalog/manage?${query}` : '/catalog/manage'
            }}
        />
    )
}
