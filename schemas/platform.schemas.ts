import { z } from 'zod'

export const resetWebhookLocksSchema = z.object({
    source: z.enum(['clerk', 'stripe']),
    eventIds: z.array(z.string().min(1)).min(1).max(25),
})
