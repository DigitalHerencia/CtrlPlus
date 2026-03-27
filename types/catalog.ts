export const WrapStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DRAFT: 'DRAFT',
} as const

export type WrapStatus = (typeof WrapStatus)[keyof typeof WrapStatus]

export const WrapCategory = {
    FULL_WRAP: 'FULL_WRAP',
    PARTIAL_WRAP: 'PARTIAL_WRAP',
    ACCENT: 'ACCENT',
    PAINT_PROTECTION_FILM: 'PAINT_PROTECTION_FILM',
} as const

export type WrapCategory = (typeof WrapCategory)[keyof typeof WrapCategory]

export const WrapImageKind = {
    HERO: 'hero',
    VISUALIZER_TEXTURE: 'visualizer_texture',
    VISUALIZER_MASK_HINT: 'visualizer_mask_hint',
    GALLERY: 'gallery',
} as const

export type WrapImageKind = (typeof WrapImageKind)[keyof typeof WrapImageKind]

export const wrapImageKindValues = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
    WrapImageKind.VISUALIZER_MASK_HINT,
    WrapImageKind.GALLERY,
] as const

export const PUBLISH_REQUIRED_WRAP_IMAGE_KINDS = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
] as const

export type PublishRequiredWrapImageKind = (typeof PUBLISH_REQUIRED_WRAP_IMAGE_KINDS)[number]

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
    createdAt: Date
    updatedAt: Date
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

export const wrapDTOFields = {
    id: true,
    name: true,
    description: true,
    price: true,
    isHidden: true,
    installationMinutes: true,
    aiPromptTemplate: true,
    aiNegativePrompt: true,
    createdAt: true,
    updatedAt: true,
    images: {
        where: { deletedAt: null },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
        orderBy: { displayOrder: 'asc' },
    },
    categoryMappings: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    deletedAt: true,
                },
            },
        },
    },
} as const

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
    file: File
}

export interface UpdateWrapImageMetadataInput {
    wrapId: string
    imageId: string
    kind?: WrapImageKind
    isActive?: boolean
}

export const WRAP_SORT_BY_VALUES = {
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
} as const

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

export interface CatalogSearchParamsResult {
    filters: SearchWrapsInput
    hasActiveFilters: boolean
}

export interface WrapFilterFormValues {
    query: string
    categoryId: string
    maxPrice: string
    sortBy: 'createdAt' | 'name' | 'price'
    sortOrder: 'desc' | 'asc'
    pageSize: '12' | '20' | '32'
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
