import { z } from 'zod'

// ─── Enums ────────────────────────────────────────────────────────────────────

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

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** Read model returned by visualizer fetchers. Never exposes raw Prisma model. */
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

// ─── Prisma Select Helpers ────────────────────────────────────────────────────

/** Explicit Prisma `select` object for VisualizerPreviewDTO fields. */
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

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const createVisualizerPreviewSchema = z.object({
    wrapId: z.string().min(1, 'Wrap ID is required'),
    file: z.instanceof(File),
})

export type CreateVisualizerPreviewInput = z.infer<typeof createVisualizerPreviewSchema>

export const regenerateVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export type RegenerateVisualizerPreviewInput = z.infer<typeof regenerateVisualizerPreviewSchema>

export const uploadPhotoSchema = createVisualizerPreviewSchema
export type UploadPhotoInput = CreateVisualizerPreviewInput

export const generatePreviewSchema = regenerateVisualizerPreviewSchema
export type GeneratePreviewInput = RegenerateVisualizerPreviewInput
