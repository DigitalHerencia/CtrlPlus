import { z } from 'zod'

import { identifierSchema } from '@/schemas/common.schemas'

export const apiIdParamSchema = z.object({
    id: identifierSchema,
})
