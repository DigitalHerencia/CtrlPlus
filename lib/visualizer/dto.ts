import type { PreviewStatus, VisualizerPreviewDTO } from './types'

type VisualizerPreviewRecord = {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: string
    cacheKey: string
    sourceWrapImageId: string | null
    sourceWrapImageVersion: number | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}

export function toVisualizerPreviewDTO(record: VisualizerPreviewRecord): VisualizerPreviewDTO {
    return {
        id: record.id,
        wrapId: record.wrapId,
        customerPhotoUrl: record.customerPhotoUrl,
        processedImageUrl: record.processedImageUrl,
        status: record.status as PreviewStatus,
        cacheKey: record.cacheKey,
        sourceWrapImageId: record.sourceWrapImageId,
        sourceWrapImageVersion: record.sourceWrapImageVersion,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    }
}
