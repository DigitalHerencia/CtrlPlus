import type { PublishRequiredWrapImageKind, WrapImageKind } from './constants'

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
