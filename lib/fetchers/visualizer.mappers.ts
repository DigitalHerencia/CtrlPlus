import { normalizePreviewStatus } from '@/lib/constants/statuses'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

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
        status: normalizePreviewStatus(record.status),
        cacheKey: record.cacheKey,
        sourceWrapImageId: record.sourceWrapImageId,
        sourceWrapImageVersion: record.sourceWrapImageVersion,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }
}
