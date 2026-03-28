import { z } from 'zod'

export const priceInCentsSchema = z.coerce
    .number()
    .int('Price must be an integer number of cents')
    .positive('Price must be positive')
    .max(10_000_000_00, 'Price exceeds supported maximum')

export const createWrapSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    description: z.string().max(500).optional(),
    price: priceInCentsSchema,
    installationMinutes: z.coerce
        .number()
        .int()
        .positive('Installation minutes must be a positive integer')
        .optional(),
    aiPromptTemplate: z.string().max(2_000).optional(),
    aiNegativePrompt: z.string().max(1_000).optional(),
})

export const updateWrapSchema = createWrapSchema.partial().extend({
    isHidden: z.boolean().optional(),
})
