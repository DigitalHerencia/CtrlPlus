import { z } from 'zod'

import { WrapImageKind, wrapImageKindValues } from '@/types/catalog/constants'

export const wrapImageUploadSchema = z.object({
    wrapId: z.string().min(1),
    kind: z.enum(wrapImageKindValues).default(WrapImageKind.GALLERY),
    isActive: z.boolean().default(true),
    file: z.instanceof(File),
})

export const updateWrapImageMetadataSchema = z.object({
    wrapId: z.string().min(1),
    imageId: z.string().min(1),
    kind: z.enum(wrapImageKindValues).optional(),
    isActive: z.boolean().optional(),
})
