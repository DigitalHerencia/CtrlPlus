import { z } from 'zod'

export const createWrapCategorySchema = z.object({
    name: z.string().min(1).max(80),
    slug: z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or dashes'),
})

export const updateWrapCategorySchema = createWrapCategorySchema.partial()

export const setWrapCategoryMappingsSchema = z.object({
    wrapId: z.string().min(1),
    categoryIds: z.array(z.string().min(1)).max(50),
})
