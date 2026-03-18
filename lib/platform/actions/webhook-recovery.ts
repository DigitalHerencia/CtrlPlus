import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import { z } from 'zod'
import { prisma } from '../../prisma'

export const retryWebhookEventSchema = z.object({
    eventId: z.string(),
})

export async function retryStripeWebhookEvent(input: z.infer<typeof retryWebhookEventSchema>) {
    const { eventId } = retryWebhookEventSchema.parse(input)
    await requirePlatformDeveloperAdmin()

    const event = await prisma.stripeWebhookEvent.findUnique({ where: { id: eventId } })
    if (!event || event.status !== 'failed') throw new Error('Event not found or not failed')

    // Enqueue for retry (implementation depends on infra)
    await prisma.stripeWebhookEvent.update({
        where: { id: eventId },
        data: { status: 'processing' },
    })

    await prisma.auditLog.create({
        data: {
            action: 'retry_stripe_webhook_event',
            resourceType: 'stripeWebhookEvent',
            resourceId: eventId,
            userId: 'platform-admin',
            details: JSON.stringify({ previousStatus: event.status }),
        },
    })

    return { ok: true }
}

export const clearStripeWebhookFailureSchema = z.object({
    eventId: z.string(),
})

export async function clearStripeWebhookFailure(
    input: z.infer<typeof clearStripeWebhookFailureSchema>
) {
    const { eventId } = clearStripeWebhookFailureSchema.parse(input)
    await requirePlatformDeveloperAdmin()

    const event = await prisma.stripeWebhookEvent.findUnique({ where: { id: eventId } })
    if (!event || event.status !== 'failed') throw new Error('Event not found or not failed')

    await prisma.stripeWebhookEvent.update({
        where: { id: eventId },
        data: { status: 'dismissed' },
    })

    await prisma.auditLog.create({
        data: {
            action: 'clear_stripe_webhook_failure',
            resourceType: 'stripeWebhookEvent',
            resourceId: eventId,
            userId: 'platform-admin',
            details: JSON.stringify({ previousStatus: event.status }),
        },
    })

    return { ok: true }
}
