import { z } from 'zod'

export const createVisualizerPreviewSchema = z.object({
    wrapId: z.string().min(1, 'Wrap ID is required'),
    file: z.instanceof(File),
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
