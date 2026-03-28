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
