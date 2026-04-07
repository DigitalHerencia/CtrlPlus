import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import type { PreviewStatus } from '@/lib/constants/statuses'

export interface VisualizerPreviewDTO {
    id: string
    wrapId: string
    uploadId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: PreviewStatus
    cacheKey: string
    referenceSignature: string
    generationMode: string
    generationProvider: string | null
    generationModel: string | null
    generationPromptVersion: string | null
    generationFallbackReason: string | null
    expiresAt: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type SerializedVisualizerPreview = VisualizerPreviewDTO

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
    searchParams: Promise<SearchParamRecord>
}

export interface VisualizerPageFeatureProps {
    requestedWrapId: string | null
    canManageCatalog: boolean
    includeHidden: boolean
}

/** Projection of a visualizer preview used as an "upload" view model. */
export interface VisualizerUploadSnapshot {
    id: string
    customerPhotoUrl: string
    mimeType: string | null
    width: number | null
    height: number | null
    createdAt: string
    updatedAt: string
}

export interface PreviewCacheKeyInput {
    wrapId: string
    ownerUserId: string
    customerPhotoHash: string
    uploadId: string
    referenceSignature: string
    generationMode: string
    generationModel: string
    promptVersion: string
}

export type VisualizerMaskStrategy = 'hf_segmentation' | 'fallback_center'

export interface BuildVehicleEditMaskResult {
    maskBuffer: Buffer
    strategy: VisualizerMaskStrategy
    notes: string[]
}

export interface BuildGenerationInputBoardResult {
    boardBuffer: Buffer
    boardMaskBuffer: Buffer
    maskStrategy: VisualizerMaskStrategy
    notes: string[]
}

export interface GenerateWrapPreviewInput {
    model: string
    prompt: string
    negativePrompt: string
    boardBuffer: Buffer
    boardMaskBuffer: Buffer
    referenceUrls: string[]
    maskUrl?: string | null
    notes?: string[]
    /**
     * Img2img denoising strength (0–1).
     * Mirrors SD `strength`: fraction of the full scheduler timestep range
     * that is applied starting from the noised init image.
     * 0 = keep original, 1 = fully regenerate. Default resolved from
     * `HF_IMG2IMG_STRENGTH` env (fallback 0.75).
     */
    strength?: number
}

export interface GenerateWrapPreviewResult {
    imageBuffer: Buffer
    status: 'ok' | 'degraded'
    finalImageUrl: string | null
    maskUrl: string | null
    referenceUrls: string[]
    model: string
    prompt: string
    notes: string[]
}

export interface VisualizerWrapPipelineResponse {
    status: 'ok' | 'degraded' | 'failed'
    finalImageUrl: string | null
    maskUrl: string | null
    referenceUrls: string[]
    model: string
    prompt: string
    notes: string[]
}

export interface ScheduledVisualizerProcessingInput {
    previewId: string
    ownerClerkUserId: string
    includeHidden: boolean
}
