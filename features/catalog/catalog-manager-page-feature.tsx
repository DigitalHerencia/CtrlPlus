import Link from 'next/link'

import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getWrapCategories } from '@/lib/catalog/fetchers/get-wrap-categories'
import { getCatalogManagerWraps } from '@/lib/catalog/fetchers/get-wraps'
import { createCatalogQueryString } from '@/lib/catalog/search-params'
import { type CatalogManagerPageFeatureProps } from '@/types/catalog'
import { CatalogFiltersClient } from './catalog-filters-client'
import { CatalogManagerClient } from './catalog-manager-client'

export async function CatalogManagerPageFeature({ filters }: CatalogManagerPageFeatureProps) {
    const [data, categories] = await Promise.all([
        getCatalogManagerWraps(filters, { includeHidden: true }),
        getWrapCategories(),
    ])

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Catalog Manager"
                title="Catalog CMS"
                description="Manage wrap metadata, categories, asset roles, and publish readiness from a single operational workspace."
                actions={
                    <Button asChild variant="outline">
                        <Link href="/catalog">Back to Gallery</Link>
                    </Button>
                }
                detail={
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                            Managed Wraps
                        </p>
                        <p className="text-3xl font-black text-neutral-100">{data.total}</p>
                    </div>
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
