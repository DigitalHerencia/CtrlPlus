import { z } from 'zod'

const safeText = z.string().trim().min(1).max(120)

export const generateVisualizerHfPreviewSchema = z.object({
    wrapId: safeText,
    make: safeText,
    model: safeText,
    year: z
        .string()
        .trim()
        .regex(/^\d{4}$/, 'Year must be a 4-digit value.'),
    trim: safeText,
})

export const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})
