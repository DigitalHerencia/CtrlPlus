import type { PublishRequiredWrapImageKind, WrapImageKind } from '@/lib/constants/statuses'
import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import { WRAP_SORT_BY_VALUES } from '@/lib/constants/app'

export interface WrapImageDTO {
    id: string
    url: string
    kind: WrapImageKind
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
}

export interface CatalogAssetImageDTO extends WrapImageDTO {
    thumbnailUrl: string
    cardUrl: string
    detailUrl: string
}

export interface WrapCategoryDTO {
    id: string
    name: string
    slug: string
}

export interface CatalogAssetReadinessIssue {
    code:
        | 'missing_name'
        | 'invalid_price'
        | 'missing_display_asset'
        | 'missing_hero'
        | 'missing_visualizer_texture'
        | 'multiple_active_hero'
        | 'multiple_active_visualizer_texture'
    message: string
    blocking: boolean
}

export interface CatalogAssetReadinessDTO {
    canPublish: boolean
    isVisualizerReady: boolean
    missingRequiredAssetRoles: PublishRequiredWrapImageKind[]
    requiredAssetRoles: PublishRequiredWrapImageKind[]
    activeAssetKinds: WrapImageKind[]
    hasDisplayAsset: boolean
    activeHeroCount: number
    activeGalleryCount: number
    activeVisualizerTextureCount: number
    activeVisualizerMaskHintCount: number
    issues: CatalogAssetReadinessIssue[]
}

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
    previewHref: string
    readiness: CatalogAssetReadinessDTO
}

export interface WrapDetailViewDTO extends WrapDTO {
    heroImage: CatalogAssetImageDTO | null
    displayImage: CatalogAssetImageDTO | null
    displayImages: CatalogAssetImageDTO[]
    galleryImages: CatalogAssetImageDTO[]
    visualizerTextureImage: CatalogAssetImageDTO | null
    visualizerMaskHintImage: CatalogAssetImageDTO | null
    readiness: CatalogAssetReadinessDTO
}

export interface WrapManagerRowDTO extends WrapDetailViewDTO {
    imageCount: number
    activeImageCount: number
}

export interface VisualizerWrapSelectionDTO {
    id: string
    name: string
    description: string | null
    price: number
    installationMinutes: number | null
    categories: WrapCategoryDTO[]
    heroImage: CatalogAssetImageDTO | null
    visualizerTextureImage: CatalogAssetImageDTO
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
    readiness: CatalogAssetReadinessDTO
}

export type CatalogBrowseCardDTO = WrapCatalogCardDTO
export type CatalogDetailDTO = WrapDetailViewDTO
export type CatalogManagerItemDTO = WrapManagerRowDTO

export interface WrapListDTO {
    wraps: WrapDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CatalogBrowseResultDTO {
    wraps: WrapCatalogCardDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CatalogManagerResultDTO {
    wraps: WrapManagerRowDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CreateWrapInput {
    name: string
    description?: string
    price: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
}

export interface UpdateWrapInput {
    name?: string
    description?: string
    price?: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
    isHidden?: boolean
}

export interface CreateWrapCategoryInput {
    name: string
    slug: string
}

export interface UpdateWrapCategoryInput {
    name?: string
    slug?: string
}

export interface SetWrapCategoryMappingsInput {
    wrapId: string
    categoryIds: string[]
}

export interface WrapImageUploadInput {
    wrapId: string
    kind: WrapImageKind
    isActive: boolean
    // server-side upload reference (data URL or approved remote URL)
    fileKey: string
}

export interface UpdateWrapImageMetadataInput {
    wrapId: string
    imageId: string
    kind?: WrapImageKind
    isActive?: boolean
}

export type WrapSortBy = (typeof WRAP_SORT_BY_VALUES)[keyof typeof WRAP_SORT_BY_VALUES]

export interface SearchWrapsInput {
    query?: string
    maxPrice?: number
    sortBy?: WrapSortBy
    sortOrder?: 'asc' | 'desc'
    page: number
    pageSize: number
    categoryId?: string
}

export interface WrapFilterFormValues {
    query: string
    categoryId: string
    maxPrice: string
    sortBy: 'createdAt' | 'name' | 'price'
    sortOrder: 'desc' | 'asc'
    pageSize: '12' | '20' | '32'
}

export interface CatalogSearchParamsResult {
    filters: SearchWrapsInput
    hasActiveFilters: boolean
}

export interface WrapFilterProps {
    categories?: Array<Pick<WrapCategoryDTO, 'id' | 'name'>>
}

export interface CatalogPageSearchParams {
    searchParams: Promise<SearchParamRecord>
}

export interface WrapRouteParams {
    wrapId: string
}

export interface WrapDetailPageParams {
    params: Promise<WrapRouteParams>
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

export interface WrapManagerDetailPageProps {
    wrap: CatalogDetailDTO
}

export interface WrapManagerRowItemProps {
    wrap: CatalogManagerItemDTO
}
