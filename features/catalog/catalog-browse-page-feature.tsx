import { Suspense } from 'react'

import { CatalogPageHeader } from '@/components/catalog/catalog-page-header'
import {
    CatalogFiltersSkeleton,
    CatalogGridSkeleton,
    CatalogPaginationSkeleton,
    CatalogResultsSummarySkeleton,
} from '@/components/catalog/catalog-skeletons'
import type { CatalogBrowsePageFeatureProps } from '@/types/catalog.types'
import {
    CatalogFiltersSection,
    CatalogResultsSection,
    CatalogResultsSummary,
} from './catalog-browse-parts'

function CatalogResultsRegionSkeleton() {
    return (
        <div className="space-y-6">
            <CatalogGridSkeleton />
            <CatalogPaginationSkeleton />
        </div>
    )
}

export function CatalogBrowsePageFeature({
    filters,
    canManageCatalog,
}: CatalogBrowsePageFeatureProps) {
    return (
        <div className="space-y-6">
            <CatalogPageHeader
                label="Catalog"
                title="Vehicle Wrap Gallery"
                description="Browse professionally managed wrap packages with deterministic product imagery, category filtering, and direct detail access."
                detail={
                    <Suspense fallback={<CatalogResultsSummarySkeleton />}>
                        <CatalogResultsSummary
                            filters={filters}
                            canManageCatalog={canManageCatalog}
                        />
                    </Suspense>
                }
            />
            <Suspense fallback={<CatalogFiltersSkeleton />}>
                <CatalogFiltersSection />
            </Suspense>
            <Suspense fallback={<CatalogResultsRegionSkeleton />}>
                <CatalogResultsSection filters={filters} canManageCatalog={canManageCatalog} />
            </Suspense>
        </div>
    )
}
