import type { PreviewStatus } from './constants'

export interface VisualizerPreviewDTO {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: PreviewStatus
    cacheKey: string
    sourceWrapImageId: string | null
    sourceWrapImageVersion: number | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}
