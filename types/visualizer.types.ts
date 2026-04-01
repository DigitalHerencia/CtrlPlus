import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import type { PreviewStatus } from '@/lib/constants/statuses'

export interface VisualizerPreviewDTO {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: PreviewStatus
    cacheKey: string
    sourceWrapImageId: string | null
    sourceWrapImageVersion: number | null
    expiresAt: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type RegenerateVisualizerPreviewInput = {
    previewId: string
}

export type ProcessVisualizerPreviewInput = {
    previewId: string
}

export interface VisualizerSearchParamsResult {
    requestedWrapId: string | null
}

export interface VisualizerPageProps {
    searchParams: SearchParamRecord
}

export interface VisualizerPageFeatureProps {
    requestedWrapId: string | null
    canManageCatalog: boolean
    includeHidden: boolean
}

export interface PreviewCacheKeyInput {
    wrapId: string
    ownerUserId: string
    customerPhotoHash: string
    sourceWrapImageId: string
    sourceAssetVersion: number
    generationMode: string
    generationModel: string
    promptVersion: string
    blendMode?: 'multiply' | 'overlay'
    opacity?: number
}
