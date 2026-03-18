import { z } from 'zod'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const PreviewStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const

export type PreviewStatus = (typeof PreviewStatus)[keyof typeof PreviewStatus]

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** Read model returned by visualizer fetchers. Never exposes raw Prisma model. */
export interface VisualizerPreviewDTO {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: PreviewStatus
    cacheKey: string
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
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
} as const

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const uploadPhotoSchema = z.object({
    wrapId: z.string().min(1, 'Wrap ID is required'),
    customerPhotoUrl: z.string().min(1, 'Photo URL is required'),
})

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>

export const generatePreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export type GeneratePreviewInput = z.infer<typeof generatePreviewSchema>
