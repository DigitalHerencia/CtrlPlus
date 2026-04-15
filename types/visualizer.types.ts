import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import type { PreviewStatus } from '@/lib/constants/statuses'

export type VisualizerVehicleCatalogIndex = Record<string, Record<string, Record<string, string[]>>>

export interface VisualizerHfWrapOption {
    id: string
    name: string
    category: string | null
    description: string
    stylePrompt: string
    promptTemplate: string
}

export interface VisualizerHfSelection {
    make: string
    model: string
    year: string
    trim: string
    wrapId: string
}

export interface VisualizerHfCatalogData {
    makes: string[]
    vehicleIndex: VisualizerVehicleCatalogIndex
    wraps: VisualizerHfWrapOption[]
    initialSelection: VisualizerHfSelection
    selectedWrapId: string | null
}

export interface GenerateVisualizerHfPreviewInput {
    wrapId: string
    make: string
    model: string
    year: string
    trim: string
}

export interface GenerateVisualizerHfPreviewResult {
    wrapId: string
    wrapName: string
    imageUrl: string
    promptUsed: string
}

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

/** Serialized representation of a VisualizerPreviewDTO (alias for clarity). */
export type SerializedVisualizerPreview = VisualizerPreviewDTO

/**
 * Search params result passed to visualizer pages (keeps API stable for routing).
 */
/**
 * VisualizerSearchParamsResult — TODO: brief description of this type.
 */
/**
 * VisualizerSearchParamsResult — TODO: brief description of this type.
 */
/**
 * VisualizerSearchParamsResult — TODO: brief description of this type.
 */
export interface VisualizerSearchParamsResult {
    requestedWrapId: string | null
}

/**
 * Props passed into the visualizer page component.
 */
/**
 * VisualizerPageProps — TODO: brief description of this type.
 */
/**
 * VisualizerPageProps — TODO: brief description of this type.
 */
/**
 * VisualizerPageProps — TODO: brief description of this type.
 */
export interface VisualizerPageProps {
    searchParams: Promise<SearchParamRecord>
}

/**
 * Props passed into feature-level visualizer components rendered on the page.
 */
/**
 * VisualizerPageFeatureProps — TODO: brief description of this type.
 */
/**
 * VisualizerPageFeatureProps — TODO: brief description of this type.
 */
/**
 * VisualizerPageFeatureProps — TODO: brief description of this type.
 */
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

/**
 * Input shape for computing a preview cache key. All fields should be stable
 * and deterministic for a given input set so the cache key is reproducible.
 */
/**
 * PreviewCacheKeyInput — TODO: brief description of this type.
 */
/**
 * PreviewCacheKeyInput — TODO: brief description of this type.
 */
/**
 * PreviewCacheKeyInput — TODO: brief description of this type.
 */
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

/** Supported masking strategies for preview generation */
export type VisualizerMaskStrategy = 'hf_segmentation' | 'fallback_center'

/** Result from building a vehicle edit mask for generation. */
export interface BuildVehicleEditMaskResult {
    maskBuffer: Buffer
    strategy: VisualizerMaskStrategy
    notes: string[]
}

/** Result from building the generation input board used by the HF pipeline. */
export interface BuildGenerationInputBoardResult {
    boardBuffer: Buffer
    boardMaskBuffer: Buffer
    maskStrategy: VisualizerMaskStrategy
    notes: string[]
}

/**
 * Payload used to request generation of a wrap preview.
 */
/**
 * GenerateWrapPreviewInput — TODO: brief description of this type.
 */
/**
 * GenerateWrapPreviewInput — TODO: brief description of this type.
 */
/**
 * GenerateWrapPreviewInput — TODO: brief description of this type.
 */
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

/**
 * Result of running the wrap generation pipeline returning image data and metadata.
 */
/**
 * GenerateWrapPreviewResult — TODO: brief description of this type.
 */
/**
 * GenerateWrapPreviewResult — TODO: brief description of this type.
 */
/**
 * GenerateWrapPreviewResult — TODO: brief description of this type.
 */
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

/**
 * High-level response shape for the wrap pipeline (ok/degraded/failed).
 */
/**
 * VisualizerWrapPipelineResponse — TODO: brief description of this type.
 */
/**
 * VisualizerWrapPipelineResponse — TODO: brief description of this type.
 */
/**
 * VisualizerWrapPipelineResponse — TODO: brief description of this type.
 */
export interface VisualizerWrapPipelineResponse {
    status: 'ok' | 'degraded' | 'failed'
    finalImageUrl: string | null
    maskUrl: string | null
    referenceUrls: string[]
    model: string
    prompt: string
    notes: string[]
}

/**
 * Input for scheduled processing jobs which operate on a preview id.
 */
/**
 * ScheduledVisualizerProcessingInput — TODO: brief description of this type.
 */
/**
 * ScheduledVisualizerProcessingInput — TODO: brief description of this type.
 */
/**
 * ScheduledVisualizerProcessingInput — TODO: brief description of this type.
 */
export interface ScheduledVisualizerProcessingInput {
    previewId: string
    ownerClerkUserId: string
    includeHidden: boolean
}
