import { z } from 'zod'

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

const wrapImageKindValues: [WrapImageKind, ...WrapImageKind[]] = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
    WrapImageKind.VISUALIZER_MASK_HINT,
    WrapImageKind.GALLERY,
]

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
    issues: Array<{
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
    }>
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

const priceInCentsSchema = z.coerce
    .number()
    .int('Price must be an integer number of cents')
    .positive('Price must be positive')
    .max(10_000_000_00, 'Price exceeds supported maximum')

export const createWrapSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    description: z.string().max(500).optional(),
    price: priceInCentsSchema,
    installationMinutes: z.coerce
        .number()
        .int()
        .positive('Installation minutes must be a positive integer')
        .optional(),
    aiPromptTemplate: z.string().max(2_000).optional(),
    aiNegativePrompt: z.string().max(1_000).optional(),
})

export type CreateWrapInput = z.infer<typeof createWrapSchema>

export const updateWrapSchema = createWrapSchema.partial().extend({
    isHidden: z.boolean().optional(),
})

export type UpdateWrapInput = z.infer<typeof updateWrapSchema>

export const createWrapCategorySchema = z.object({
    name: z.string().min(1).max(80),
    slug: z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or dashes'),
})

export type CreateWrapCategoryInput = z.infer<typeof createWrapCategorySchema>

export const updateWrapCategorySchema = createWrapCategorySchema.partial()

export type UpdateWrapCategoryInput = z.infer<typeof updateWrapCategorySchema>

export const setWrapCategoryMappingsSchema = z.object({
    wrapId: z.string().min(1),
    categoryIds: z.array(z.string().min(1)).max(50),
})

export type SetWrapCategoryMappingsInput = z.infer<typeof setWrapCategoryMappingsSchema>

export const wrapImageUploadSchema = z.object({
    wrapId: z.string().min(1),
    kind: z.enum(wrapImageKindValues).default(WrapImageKind.GALLERY),
    isActive: z.boolean().default(true),
    file: z.instanceof(File),
})

export type WrapImageUploadInput = z.infer<typeof wrapImageUploadSchema>

export const updateWrapImageMetadataSchema = z.object({
    wrapId: z.string().min(1),
    imageId: z.string().min(1),
    kind: z.enum(wrapImageKindValues).optional(),
    isActive: z.boolean().optional(),
})

export type UpdateWrapImageMetadataInput = z.infer<typeof updateWrapImageMetadataSchema>

export const WRAP_SORT_BY_VALUES = {
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
} as const

export type WrapSortBy = (typeof WRAP_SORT_BY_VALUES)[keyof typeof WRAP_SORT_BY_VALUES]

export const searchWrapsSchema = z.object({
    query: z.string().max(200).optional(),
    maxPrice: priceInCentsSchema.optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    categoryId: z.string().min(1).optional(),
})

export type SearchWrapsInput = z.infer<typeof searchWrapsSchema>
