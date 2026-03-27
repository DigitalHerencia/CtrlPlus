import type { VisualizerWrapSelectionDTO } from '@/types/catalog'

export const PreviewStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const

export type PreviewStatus = (typeof PreviewStatus)[keyof typeof PreviewStatus]

export const VisualizerGenerationMode = {
    HUGGING_FACE: 'huggingface',
    DETERMINISTIC_FALLBACK: 'deterministic_fallback',
} as const

export type VisualizerGenerationMode =
    (typeof VisualizerGenerationMode)[keyof typeof VisualizerGenerationMode]

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

export const visualizerPreviewDTOFields = {
    id: true,
    wrapId: true,
    customerPhotoUrl: true,
    processedImageUrl: true,
    status: true,
    cacheKey: true,
    sourceWrapImageId: true,
    sourceWrapImageVersion: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
} as const

export interface CreateVisualizerPreviewInput {
    wrapId: string
    file: File
}

export interface RegenerateVisualizerPreviewInput {
    previewId: string
}

export interface ProcessVisualizerPreviewInput {
    previewId: string
}

export type UploadPhotoInput = CreateVisualizerPreviewInput
export type GeneratePreviewInput = ProcessVisualizerPreviewInput

export interface VisualizerSearchParamsResult {
    requestedWrapId: string | null
}

export interface VisualizerPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export interface VisualizerPageFeatureProps {
    requestedWrapId: string | null
    canManageCatalog: boolean
    includeHidden: boolean
}

export interface VisualizerWorkspaceClientProps {
    wraps: VisualizerWrapSelectionDTO[]
    initialWrapId: string | null
    canManageCatalog: boolean
}
