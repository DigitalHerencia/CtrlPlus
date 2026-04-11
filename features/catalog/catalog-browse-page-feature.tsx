/**
 * @introduction Features — TODO: short one-line summary of catalog-browse-page-feature.tsx
 *
 * @description TODO: longer description for catalog-browse-page-feature.tsx. Keep it short — one or two sentences.
 * Domain: features
 * Public: TODO (yes/no)
 */
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
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'

function CatalogResultsRegionSkeleton() {
    return (
        <div className="space-y-6">
            <CatalogGridSkeleton />
            <CatalogPaginationSkeleton />
        </div>
    )
}

/**
 * CatalogBrowsePageFeature — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CatalogBrowsePageFeature({
    filters,
    canManageCatalog,
}: CatalogBrowsePageFeatureProps) {
    return (
        <div className="space-y-6">
            <CatalogPageHeader
                label="Catalog"
                title="Vehicle Wrap Gallery"
                description="Explore premium wrap styles built for attention, compare finish options quickly, and move from inspiration to booking with confidence."
            />
            <WorkspacePageContextCard
                title="Catalog Snapshot"
                description="Live result and publishing visibility"
            >
                <Suspense fallback={<CatalogResultsSummarySkeleton />}>
                    <CatalogResultsSummary filters={filters} canManageCatalog={canManageCatalog} />
                </Suspense>
            </WorkspacePageContextCard>
            <Suspense fallback={<CatalogFiltersSkeleton />}>
                <CatalogFiltersSection />
            </Suspense>
            <Suspense fallback={<CatalogResultsRegionSkeleton />}>
                <CatalogResultsSection filters={filters} canManageCatalog={canManageCatalog} />
            </Suspense>
        </div>
    )
}
