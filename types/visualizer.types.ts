import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import type { PreviewStatus } from '@/lib/constants/statuses'

export type VisualizerVehicleCatalogIndex = Record<string, Record<string, Record<string, string[]>>>

export interface VisualizerHfWrapOption {
    id: string
    name: string
    category: string | null
    description: string
    design_traits?: string[]
    best_for?: string[]
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

export type SerializedVisualizerPreview = VisualizerPreviewDTO

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
