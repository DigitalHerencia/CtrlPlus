import { z } from 'zod'

function isFileValue(value: unknown): value is File {
    return typeof File !== 'undefined' && value instanceof File
}

export const createVisualizerPreviewSchema = z
    .object({
        wrapId: z.string().min(1, 'Wrap ID is required'),
        // Accept either a server-side file key/reference (fileKey) or a browser File (file)
        fileKey: z.string().min(1).optional(),
        file: z
            .custom<File>(isFileValue, {
                message: 'File must be a browser File upload.',
            })
            .optional(),
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

export const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})
