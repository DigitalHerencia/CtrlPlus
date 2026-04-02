import { z } from 'zod'

export const platformHealthQuerySchema = z.object({
    includeDependencies: z.coerce.boolean().optional().default(false),
})

export const webhookMaintenanceSchema = z.object({
    source: z.enum(['clerk', 'stripe']),
    operation: z.enum(['cleanup-stale-locks']),
})

export const replayWebhookFailuresSchema = z.object({
    eventIds: z.array(z.string().min(1)).min(1).max(25),
})

export const previewPruneSchema = z.object({
    olderThanDays: z.coerce.number().int().min(1).max(365).default(30),
})

export const platformActionFilterSchema = z.object({
    source: z
        .enum(['all', 'stripe', 'clerk', 'database', 'cloudinary', 'huggingface'])
        .default('all'),
    limit: z.coerce.number().int().min(1).max(100).default(25),
})

export const resetWebhookLocksSchema = z.object({
    source: z.enum(['clerk', 'stripe']),
    eventIds: z.array(z.string().min(1)).min(1).max(25),
})
