import type { ReactNode } from 'react'
import { Suspense } from 'react'

import {
    CatalogFiltersSkeleton,
    CatalogGridSkeleton,
    CatalogPaginationSkeleton,
    CatalogResultsSummarySkeleton,
} from '@/components/catalog/catalog-skeletons'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface CatalogBrowsePageViewProps {
    canManageCatalog: boolean
    resultsSummary: ReactNode
    filtersSection: ReactNode
    resultsSection: ReactNode
}

function CatalogResultsRegionSkeleton() {
    return (
        <div className="space-y-6">
            <CatalogGridSkeleton />
            <CatalogPaginationSkeleton />
        </div>
    )
}

export function CatalogBrowsePageView({
    canManageCatalog,
    resultsSummary,
    filtersSection,
    resultsSection,
}: CatalogBrowsePageViewProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Catalog"
                title="Vehicle Wrap Gallery"
                description="Explore premium wrap styles built for attention, compare finish options quickly, and move from inspiration to booking with confidence."
            />
            {canManageCatalog ? (
                <WorkspacePageContextCard
                    title="Catalog Snapshot"
                    description="Live result and publishing visibility"
                >
                    <Suspense fallback={<CatalogResultsSummarySkeleton />}>
                        {resultsSummary}
                    </Suspense>
                </WorkspacePageContextCard>
            ) : null}
            <Suspense fallback={<CatalogFiltersSkeleton />}>{filtersSection}</Suspense>
            <Suspense fallback={<CatalogResultsRegionSkeleton />}>{resultsSection}</Suspense>
        </div>
    )
}
