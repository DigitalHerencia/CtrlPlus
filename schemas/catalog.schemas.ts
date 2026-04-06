import { z } from 'zod'

import { WrapImageKind } from '@/lib/constants/statuses'

const activeCatalogImageKinds = [WrapImageKind.HERO, WrapImageKind.GALLERY] as const

export const createWrapCategorySchema = z.object({
    name: z.string().min(1).max(80),
    slug: z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or dashes'),
})

export const setWrapCategoryMappingsSchema = z.object({
    wrapId: z.string().min(1),
    categoryIds: z.array(z.string().min(1)).max(50),
})

export const wrapImageUploadSchema = z.object({
    wrapId: z.string().min(1),
    kind: z.enum(activeCatalogImageKinds).default(WrapImageKind.GALLERY),
    isActive: z.boolean().default(true),
    // Accept a server-side file key/reference (uploads handled by upload layer), not a browser File
    fileKey: z.string().min(1),
})

export const updateWrapImageMetadataSchema = z.object({
    wrapId: z.string().min(1),
    imageId: z.string().min(1),
    kind: z.enum(activeCatalogImageKinds).optional(),
    isActive: z.boolean().optional(),
})

export const searchWrapsSchema = z.object({
    query: z.string().max(200).optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    categoryId: z.string().min(1).optional(),
})

export const wrapFilterFormSchema = z.object({
    query: z.string().trim().max(200, 'Search must be 200 characters or fewer.'),
    categoryId: z.string().trim().max(64).default(''),
    sortBy: z.enum(['createdAt', 'name', 'price']),
})

export const createWrapSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    description: z.string().max(500).optional(),
    price: z.coerce
        .number()
        .int('Price must be an integer number of cents')
        .positive('Price must be positive')
        .max(10_000_000_00, 'Price exceeds supported maximum'),
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
