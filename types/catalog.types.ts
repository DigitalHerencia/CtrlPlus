/**
 * @introduction Types — TODO: short one-line summary of catalog.types.ts
 *
 * @description TODO: longer description for catalog.types.ts. Keep it short — one or two sentences.
 * Domain: types
 * Public: TODO (yes/no)
 */
import type { PublishRequiredWrapImageKind, WrapImageKind } from '@/lib/constants/statuses'
import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import type { z } from 'zod'
import { WRAP_SORT_BY_VALUES } from '@/lib/constants/app'
import { createWrapSchema } from '@/schemas/catalog.schemas'

/**
 * WrapImageDTO — TODO: brief description of this type.
 */
/**
 * WrapImageDTO — TODO: brief description of this type.
 */
/**
 * WrapImageDTO — TODO: brief description of this type.
 */
export interface WrapImageDTO {
    id: string
    url: string
    kind: WrapImageKind
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
    thumbnailUrl: string
    cardUrl: string
    detailUrl: string
}

/**
 * CatalogAssetImageDTO — TODO: brief description of this type.
 */
/**
 * CatalogAssetImageDTO — TODO: brief description of this type.
 */
/**
 * CatalogAssetImageDTO — TODO: brief description of this type.
 */
export type CatalogAssetImageDTO = WrapImageDTO

/**
 * WrapCategoryDTO — TODO: brief description of this type.
 */
/**
 * WrapCategoryDTO — TODO: brief description of this type.
 */
/**
 * WrapCategoryDTO — TODO: brief description of this type.
 */
export interface WrapCategoryDTO {
    id: string
    name: string
    slug: string
}

/**
 * CatalogAssetReadinessIssue — TODO: brief description of this type.
 */
/**
 * CatalogAssetReadinessIssue — TODO: brief description of this type.
 */
/**
 * CatalogAssetReadinessIssue — TODO: brief description of this type.
 */
export interface CatalogAssetReadinessIssue {
    code:
        | 'missing_name'
        | 'invalid_price'
        | 'missing_display_asset'
        | 'missing_hero'
        | 'multiple_active_hero'
    message: string
    blocking: boolean
}

/**
 * CatalogAssetReadinessDTO — TODO: brief description of this type.
 */
/**
 * CatalogAssetReadinessDTO — TODO: brief description of this type.
 */
/**
 * CatalogAssetReadinessDTO — TODO: brief description of this type.
 */
export interface CatalogAssetReadinessDTO {
    canPublish: boolean
    isVisualizerReady: boolean
    missingRequiredAssetRoles: PublishRequiredWrapImageKind[]
    requiredAssetRoles: PublishRequiredWrapImageKind[]
    activeAssetKinds: WrapImageKind[]
    hasDisplayAsset: boolean
    activeHeroCount: number
    activeGalleryCount: number
    issues: CatalogAssetReadinessIssue[]
}

/**
 * WrapDTO — TODO: brief description of this type.
 */
/**
 * WrapDTO — TODO: brief description of this type.
 */
/**
 * WrapDTO — TODO: brief description of this type.
 */
export interface WrapDTO {
    id: string
    name: string
    description: string | null
    price: number
    isHidden: boolean
    installationMinutes: number | null
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
    images: WrapImageDTO[]
    categories: WrapCategoryDTO[]
    createdAt: Timestamp
    updatedAt: Timestamp
}

/**
 * WrapCatalogCardDTO — TODO: brief description of this type.
 */
/**
 * WrapCatalogCardDTO — TODO: brief description of this type.
 */
/**
 * WrapCatalogCardDTO — TODO: brief description of this type.
 */
export interface WrapCatalogCardDTO {
    id: string
    name: string
    description: string | null
    price: number
    isHidden: boolean
    installationMinutes: number | null
    categories: WrapCategoryDTO[]
    heroImage: CatalogAssetImageDTO | null
    displayImage: CatalogAssetImageDTO | null
    schedulingHref: string
    visualizerHref: string
    readiness: CatalogAssetReadinessDTO
}

/**
 * WrapDetailViewDTO — TODO: brief description of this type.
 */
/**
 * WrapDetailViewDTO — TODO: brief description of this type.
 */
/**
 * WrapDetailViewDTO — TODO: brief description of this type.
 */
export interface WrapDetailViewDTO extends WrapDTO {
    heroImage: CatalogAssetImageDTO | null
    displayImage: CatalogAssetImageDTO | null
    displayImages: CatalogAssetImageDTO[]
    galleryImages: CatalogAssetImageDTO[]
    readiness: CatalogAssetReadinessDTO
}

/**
 * WrapManagerRowDTO — TODO: brief description of this type.
 */
/**
 * WrapManagerRowDTO — TODO: brief description of this type.
 */
/**
 * WrapManagerRowDTO — TODO: brief description of this type.
 */
export interface WrapManagerRowDTO extends WrapDetailViewDTO {
    imageCount: number
    activeImageCount: number
}

/**
 * VisualizerWrapSelectionDTO — TODO: brief description of this type.
 */
/**
 * VisualizerWrapSelectionDTO — TODO: brief description of this type.
 */
/**
 * VisualizerWrapSelectionDTO — TODO: brief description of this type.
 */
export interface VisualizerWrapSelectionDTO {
    id: string
    name: string
    description: string | null
    price: number
    installationMinutes: number | null
    categories: WrapCategoryDTO[]
    heroImage: CatalogAssetImageDTO | null
    galleryImages: CatalogAssetImageDTO[]
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
    readiness: CatalogAssetReadinessDTO
}

/**
 * CatalogBrowseCardDTO — TODO: brief description of this type.
 */
/**
 * CatalogBrowseCardDTO — TODO: brief description of this type.
 */
/**
 * CatalogBrowseCardDTO — TODO: brief description of this type.
 */
export type CatalogBrowseCardDTO = WrapCatalogCardDTO
/**
 * CatalogDetailDTO — TODO: brief description of this type.
 */
/**
 * CatalogDetailDTO — TODO: brief description of this type.
 */
/**
 * CatalogDetailDTO — TODO: brief description of this type.
 */
export type CatalogDetailDTO = WrapDetailViewDTO
/**
 * CatalogManagerItemDTO — TODO: brief description of this type.
 */
/**
 * CatalogManagerItemDTO — TODO: brief description of this type.
 */
/**
 * CatalogManagerItemDTO — TODO: brief description of this type.
 */
export type CatalogManagerItemDTO = WrapManagerRowDTO

/**
 * WrapListDTO — TODO: brief description of this type.
 */
/**
 * WrapListDTO — TODO: brief description of this type.
 */
/**
 * WrapListDTO — TODO: brief description of this type.
 */
export interface WrapListDTO {
    wraps: WrapDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * CatalogBrowseResultDTO — TODO: brief description of this type.
 */
/**
 * CatalogBrowseResultDTO — TODO: brief description of this type.
 */
/**
 * CatalogBrowseResultDTO — TODO: brief description of this type.
 */
export interface CatalogBrowseResultDTO {
    wraps: WrapCatalogCardDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * CatalogManagerResultDTO — TODO: brief description of this type.
 */
/**
 * CatalogManagerResultDTO — TODO: brief description of this type.
 */
/**
 * CatalogManagerResultDTO — TODO: brief description of this type.
 */
export interface CatalogManagerResultDTO {
    wraps: WrapManagerRowDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * CreateWrapInput — represents validated input data for creating a wrap
 */
/**
 * CreateWrapInput — represents validated input data for creating a wrap
 */
/**
 * CreateWrapInput — represents validated input data for creating a wrap
 */
export type CreateWrapInput = z.infer<typeof createWrapSchema>

/**
 * UpdateWrapInput — TODO: brief description of this type.
 */
/**
 * UpdateWrapInput — TODO: brief description of this type.
 */
/**
 * UpdateWrapInput — TODO: brief description of this type.
 */
export interface UpdateWrapInput {
    name?: string
    description?: string
    price?: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
    isHidden?: boolean
}

/**
 * CreateWrapCategoryInput — TODO: brief description of this type.
 */
/**
 * CreateWrapCategoryInput — TODO: brief description of this type.
 */
/**
 * CreateWrapCategoryInput — TODO: brief description of this type.
 */
export interface CreateWrapCategoryInput {
    name: string
    slug: string
}

/**
 * UpdateWrapCategoryInput — TODO: brief description of this type.
 */
/**
 * UpdateWrapCategoryInput — TODO: brief description of this type.
 */
/**
 * UpdateWrapCategoryInput — TODO: brief description of this type.
 */
export interface UpdateWrapCategoryInput {
    name?: string
    slug?: string
}

/**
 * SetWrapCategoryMappingsInput — TODO: brief description of this type.
 */
/**
 * SetWrapCategoryMappingsInput — TODO: brief description of this type.
 */
/**
 * SetWrapCategoryMappingsInput — TODO: brief description of this type.
 */
export interface SetWrapCategoryMappingsInput {
    wrapId: string
    categoryIds: string[]
}

/**
 * WrapImageUploadInput — TODO: brief description of this type.
 */
/**
 * WrapImageUploadInput — TODO: brief description of this type.
 */
/**
 * WrapImageUploadInput — TODO: brief description of this type.
 */
export interface WrapImageUploadInput {
    wrapId: string
    kind: WrapImageKind
    isActive: boolean
    // server-side upload reference (data URL or approved remote URL)
    fileKey: string
}

/**
 * UpdateWrapImageMetadataInput — TODO: brief description of this type.
 */
/**
 * UpdateWrapImageMetadataInput — TODO: brief description of this type.
 */
/**
 * UpdateWrapImageMetadataInput — TODO: brief description of this type.
 */
export interface UpdateWrapImageMetadataInput {
    wrapId: string
    imageId: string
    kind?: WrapImageKind
    isActive?: boolean
}

/**
 * WrapSortBy — TODO: brief description of this type.
 */
/**
 * WrapSortBy — TODO: brief description of this type.
 */
/**
 * WrapSortBy — TODO: brief description of this type.
 */
export type WrapSortBy = (typeof WRAP_SORT_BY_VALUES)[keyof typeof WRAP_SORT_BY_VALUES]

/**
 * SearchWrapsInput — TODO: brief description of this type.
 */
/**
 * SearchWrapsInput — TODO: brief description of this type.
 */
/**
 * SearchWrapsInput — TODO: brief description of this type.
 */
export interface SearchWrapsInput {
    query?: string
    sortBy?: WrapSortBy
    page: number
    pageSize: number
    categoryId?: string
}

/**
 * WrapFilterFormValues — TODO: brief description of this type.
 */
/**
 * WrapFilterFormValues — TODO: brief description of this type.
 */
/**
 * WrapFilterFormValues — TODO: brief description of this type.
 */
export interface WrapFilterFormValues {
    query: string
    categoryId: string
    sortBy: 'createdAt' | 'name' | 'price'
}

/**
 * CatalogSearchParamsResult — TODO: brief description of this type.
 */
/**
 * CatalogSearchParamsResult — TODO: brief description of this type.
 */
/**
 * CatalogSearchParamsResult — TODO: brief description of this type.
 */
export interface CatalogSearchParamsResult {
    filters: SearchWrapsInput
    hasActiveFilters: boolean
}

/**
 * WrapFilterProps — TODO: brief description of this type.
 */
/**
 * WrapFilterProps — TODO: brief description of this type.
 */
/**
 * WrapFilterProps — TODO: brief description of this type.
 */
export interface WrapFilterProps {
    categories?: Array<Pick<WrapCategoryDTO, 'id' | 'name'>>
}

/**
 * CatalogPageSearchParams — TODO: brief description of this type.
 */
/**
 * CatalogPageSearchParams — TODO: brief description of this type.
 */
/**
 * CatalogPageSearchParams — TODO: brief description of this type.
 */
export interface CatalogPageSearchParams {
    searchParams: Promise<SearchParamRecord>
}

/**
 * WrapRouteParams — TODO: brief description of this type.
 */
/**
 * WrapRouteParams — TODO: brief description of this type.
 */
/**
 * WrapRouteParams — TODO: brief description of this type.
 */
export interface WrapRouteParams {
    wrapId: string
}

/**
 * WrapDetailPageParams — TODO: brief description of this type.
 */
/**
 * WrapDetailPageParams — TODO: brief description of this type.
 */
/**
 * WrapDetailPageParams — TODO: brief description of this type.
 */
export interface WrapDetailPageParams {
    params: Promise<WrapRouteParams>
}

/**
 * CatalogBrowsePageFeatureProps — TODO: brief description of this type.
 */
/**
 * CatalogBrowsePageFeatureProps — TODO: brief description of this type.
 */
/**
 * CatalogBrowsePageFeatureProps — TODO: brief description of this type.
 */
export interface CatalogBrowsePageFeatureProps {
    filters: SearchWrapsInput
    canManageCatalog: boolean
}

/**
 * CatalogDetailPageFeatureProps — TODO: brief description of this type.
 */
/**
 * CatalogDetailPageFeatureProps — TODO: brief description of this type.
 */
/**
 * CatalogDetailPageFeatureProps — TODO: brief description of this type.
 */
export interface CatalogDetailPageFeatureProps {
    wrapId: string
    canManageCatalog: boolean
}

/**
 * CatalogManagerPageFeatureProps — TODO: brief description of this type.
 */
/**
 * CatalogManagerPageFeatureProps — TODO: brief description of this type.
 */
/**
 * CatalogManagerPageFeatureProps — TODO: brief description of this type.
 */
export interface CatalogManagerPageFeatureProps {
    filters: SearchWrapsInput
}

/**
 * CatalogManagerProps — TODO: brief description of this type.
 */
/**
 * CatalogManagerProps — TODO: brief description of this type.
 */
/**
 * CatalogManagerProps — TODO: brief description of this type.
 */
export interface CatalogManagerProps {
    wraps: CatalogManagerItemDTO[]
    categories: WrapCategoryDTO[]
}

/**
 * WrapManagerDetailPageProps — TODO: brief description of this type.
 */
/**
 * WrapManagerDetailPageProps — TODO: brief description of this type.
 */
/**
 * WrapManagerDetailPageProps — TODO: brief description of this type.
 */
export interface WrapManagerDetailPageProps {
    wrap: CatalogDetailDTO
}

/**
 * WrapManagerRowItemProps — TODO: brief description of this type.
 */
/**
 * WrapManagerRowItemProps — TODO: brief description of this type.
 */
/**
 * WrapManagerRowItemProps — TODO: brief description of this type.
 */
export interface WrapManagerRowItemProps {
    wrap: CatalogManagerItemDTO
}
