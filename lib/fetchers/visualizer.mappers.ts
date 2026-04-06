import { normalizePreviewStatus } from '@/lib/constants/statuses'
import {
    buildSignedVisualizerPreviewImageUrl,
    buildSignedVisualizerUploadUrl,
} from '@/lib/visualizer/signed-asset-urls'
import type { VisualizerPreviewDTO, VisualizerUploadSnapshot } from '@/types/visualizer.types'

type VisualizerUploadRecord = {
    id: string
    mimeType: string | null
    width: number | null
    height: number | null
    createdAt: Date
    updatedAt: Date
}

type VisualizerPreviewRecord = {
    id: string
    wrapId: string
    uploadId: string
    processedImageUrl: string | null
    status: string
    cacheKey: string
    referenceSignature: string
    generationMode: string
    generationProvider: string | null
    generationModel: string | null
    generationPromptVersion: string | null
    generationFallbackReason: string | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    upload: VisualizerUploadRecord
}

export function toVisualizerUploadSnapshot(record: VisualizerUploadRecord): VisualizerUploadSnapshot {
    return {
        id: record.id,
        customerPhotoUrl: buildSignedVisualizerUploadUrl(record.id),
        mimeType: record.mimeType,
        width: record.width,
        height: record.height,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }
}

export function toVisualizerPreviewDTO(record: VisualizerPreviewRecord): VisualizerPreviewDTO {
    const normalizedStatus = normalizePreviewStatus(record.status)

    return {
        id: record.id,
        wrapId: record.wrapId,
        uploadId: record.uploadId,
        customerPhotoUrl: buildSignedVisualizerUploadUrl(record.upload.id),
        processedImageUrl:
            normalizedStatus === 'complete'
                ? buildSignedVisualizerPreviewImageUrl(record.id)
                : null,
        status: normalizedStatus,
        cacheKey: record.cacheKey,
        referenceSignature: record.referenceSignature,
        generationMode: record.generationMode,
        generationProvider: record.generationProvider,
        generationModel: record.generationModel,
        generationPromptVersion: record.generationPromptVersion,
        generationFallbackReason: record.generationFallbackReason,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }
}
