import { z } from 'zod'

function isFileValue(value: unknown): value is File {
    return typeof File !== 'undefined' && value instanceof File
}

export const createVisualizerUploadSchema = z.object({
    file: z.custom<File>(isFileValue, {
        message: 'File must be a browser File upload.',
    }),
})

export const createVisualizerPreviewSchema = z
    .object({
        wrapId: z.string().min(1, 'Wrap ID is required'),
        uploadId: z.string().min(1, 'Upload ID is required'),
    })

export const regenerateVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export const processVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})
