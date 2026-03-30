import { z } from 'zod'

export const createVisualizerPreviewSchema = z.object({
    wrapId: z.string().min(1, 'Wrap ID is required'),
    // Accept a server-side file key/reference (uploads handled in upload pipeline), not a browser File
    fileKey: z.string().min(1, 'File key is required'),
})

export const regenerateVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export const processVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export const uploadPhotoSchema = createVisualizerPreviewSchema
export const generatePreviewSchema = processVisualizerPreviewSchema

export const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})
