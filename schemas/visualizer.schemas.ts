import { z } from 'zod'

export const createVisualizerPreviewSchema = z
    .object({
        wrapId: z.string().min(1, 'Wrap ID is required'),
        // Accept either a server-side file key/reference (fileKey) or a browser File (file)
        fileKey: z.string().min(1).optional(),
        file: z.any().optional(),
    })
    .refine((obj) => !!obj.fileKey || !!obj.file, {
        message: 'Either fileKey or file is required',
        path: ['fileKey', 'file'],
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
