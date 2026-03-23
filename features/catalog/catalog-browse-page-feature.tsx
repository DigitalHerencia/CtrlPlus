import Link from 'next/link'

import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { WrapFilter } from '@/components/catalog/WrapFilter'
import { WrapGrid } from '@/components/catalog/WrapGrid'
import { getWrapCategories } from '@/lib/catalog/fetchers/get-wrap-categories'
import { searchCatalogWraps } from '@/lib/catalog/fetchers/get-wraps'
import { createCatalogPageHref } from '@/lib/catalog/search-params'
import { type SearchWrapsInput } from '@/lib/catalog/types'

interface CatalogBrowsePageFeatureProps {
    filters: SearchWrapsInput
    canManageCatalog: boolean
}

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
            <WrapFilter categories={categories} />
            <WrapGrid wraps={data.wraps} canManageCatalog={canManageCatalog} />
            <CatalogPagination
                page={data.page}
                totalPages={data.totalPages}
                createPageHref={(page) => createCatalogPageHref(filters, page)}
            />
        </div>
    )
}
