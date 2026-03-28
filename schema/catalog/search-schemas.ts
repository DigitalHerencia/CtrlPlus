import { z } from 'zod'

import { priceInCentsSchema } from './wrap-schemas'

export const searchWrapsSchema = z.object({
    query: z.string().max(200).optional(),
    maxPrice: priceInCentsSchema.optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    categoryId: z.string().min(1).optional(),
})

export const wrapFilterFormSchema = z.object({
    query: z.string().trim().max(200, 'Search must be 200 characters or fewer.'),
    categoryId: z.string().trim().max(64).default(''),
    maxPrice: z
        .string()
        .trim()
        .refine((value) => value === '' || /^\d+$/.test(value), 'Use whole cents only.')
        .refine(
            (value) => value === '' || Number(value) <= 1_000_000_000,
            'Max price is too large.'
        ),
    sortBy: z.enum(['createdAt', 'name', 'price']),
    sortOrder: z.enum(['desc', 'asc']),
    pageSize: z.enum(['12', '20', '32']),
})
