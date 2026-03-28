import type { CatalogManagerItemDTO, WrapCategoryDTO } from './domain'
import type { SearchWrapsInput, WrapFilterFormValues } from './inputs'

export interface CatalogSearchParamsResult {
    filters: SearchWrapsInput
    hasActiveFilters: boolean
}

export interface WrapFilterProps {
    categories?: Array<Pick<WrapCategoryDTO, 'id' | 'name'>>
}

export interface CatalogPageSearchParams {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export interface WrapDetailPageParams {
    params: Promise<{ id: string }>
}

export interface CatalogBrowsePageFeatureProps {
    filters: SearchWrapsInput
    canManageCatalog: boolean
}

export interface CatalogDetailPageFeatureProps {
    wrapId: string
    canManageCatalog: boolean
}

export interface CatalogManagerPageFeatureProps {
    filters: SearchWrapsInput
}

export interface CatalogManagerProps {
    wraps: CatalogManagerItemDTO[]
    categories: WrapCategoryDTO[]
}

export type { WrapFilterFormValues }
