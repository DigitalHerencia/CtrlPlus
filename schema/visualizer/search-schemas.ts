import { z } from 'zod'

export const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})
