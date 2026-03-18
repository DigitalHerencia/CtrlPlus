import { z } from 'zod'
import { prisma } from '../../prisma'

// Fetches Stripe webhook system status, recent failures, and retry queue
export async function getStripeWebhookStatus() {
    // Example: count failures, get last success/failure, queue length
    const [failureCount, lastFailure, lastSuccess, queueLength] = await Promise.all([
        prisma.stripeWebhookEvent.count({ where: { status: 'failed' } }),
        prisma.stripeWebhookEvent.findFirst({
            where: { status: 'failed' },
            orderBy: { processedAt: 'desc' },
        }),
        prisma.stripeWebhookEvent.findFirst({
            where: { status: 'processed' },
            orderBy: { processedAt: 'desc' },
        }),
        prisma.stripeWebhookEvent.count({ where: { status: 'processing' } }),
    ])
    return {
        failureCount,
        lastFailure,
        lastSuccess,
        queueLength,
    }
}

// Paginated list of failed Stripe webhook events
export const getStripeWebhookFailuresSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(20),
})

export async function getStripeWebhookFailures(
    input: z.infer<typeof getStripeWebhookFailuresSchema>
) {
    const { page, pageSize } = getStripeWebhookFailuresSchema.parse(input)
    const [failures, total] = await Promise.all([
        prisma.stripeWebhookEvent.findMany({
            where: { status: 'failed' },
            orderBy: { processedAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.stripeWebhookEvent.count({ where: { status: 'failed' } }),
    ])
    return { failures, total, page, pageSize }
}
