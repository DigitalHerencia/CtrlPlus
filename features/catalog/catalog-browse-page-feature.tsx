import { CatalogBrowsePageView } from '@/components/catalog/catalog-browse-page-view'
import type { CatalogBrowsePageFeatureProps } from '@/types/catalog.types'

import {
    CatalogFiltersSection,
    CatalogResultsSection,
    CatalogResultsSummary,
} from './catalog-browse-parts'

export function CatalogBrowsePageFeature({
    filters,
    canManageCatalog,
}: CatalogBrowsePageFeatureProps) {
    return (
        <CatalogBrowsePageView
            canManageCatalog={canManageCatalog}
            resultsSummary={
                <CatalogResultsSummary filters={filters} canManageCatalog={canManageCatalog} />
            }
            filtersSection={<CatalogFiltersSection />}
            resultsSection={
                <CatalogResultsSection filters={filters} canManageCatalog={canManageCatalog} />
            }
        />
    )
}
