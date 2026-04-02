'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'

import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import { processStripeWebhookEvent } from '@/lib/actions/billing.actions'
import {
    previewPruneSchema,
    replayWebhookFailuresSchema,
    resetWebhookLocksSchema,
    webhookMaintenanceSchema,
} from '@/schemas/platform.schemas'
import type { ResetWebhookLocksInput } from '@/types/platform.types'
import type { Prisma } from '@prisma/client'
import { revalidatePlatformPaths } from '@/lib/cache/revalidate-tags'
import type Stripe from 'stripe'

import { WEBHOOK_STALE_THRESHOLD_MINUTES } from '@/lib/constants/app'
import { writeOperationalAuditLog } from '@/lib/integrations/audit-log'
import { observability } from '@/lib/integrations/observability'
import type { WebhookMutationResultDTO, WebhookReplayResultDTO } from '@/types/platform.types'

export async function pruneVisualizerPreviews(rawInput?: {
    olderThanDays?: number
}): Promise<{ affectedCount: number }> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'dashboard.owner')
    const input = previewPruneSchema.parse(rawInput ?? {})

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - input.olderThanDays)

    const result = await prisma.visualizerPreview.updateMany({
        where: {
            deletedAt: null,
            createdAt: { lt: cutoff },
        },
        data: { deletedAt: new Date() },
    })

    await writeOperationalAuditLog({
        userId,
        action: 'platform.pruneVisualizerPreviews',
        resourceType: 'VisualizerPreview',
        resourceId: 'platform:visualizer-previews',
        details: {
            olderThanDays: input.olderThanDays,
            prunedCount: result.count,
        },
    })

    revalidatePlatformPaths()

    return { affectedCount: result.count }
}

export async function pruneOldPreviews(): Promise<void> {
    await pruneVisualizerPreviews()
}

function getStoredStripeEvent(
    payload: unknown,
    eventId: string,
    eventType: string
): Stripe.Event | null {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return null
    }

    const candidate = payload as Partial<Stripe.Event>
    if (candidate.id !== eventId || candidate.type !== eventType) {
        return null
    }

    if (!candidate.data || typeof candidate.data !== 'object' || !('object' in candidate.data)) {
        return null
    }

    return candidate as Stripe.Event
}

export async function clearStuckWebhookProcessingEvents(): Promise<WebhookMutationResultDTO> {
    const session = await requirePlatformDeveloperAdmin()

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    webhookMaintenanceSchema.parse({
        source: 'stripe',
        operation: 'cleanup-stale-locks',
    })

    const staleCutoff = new Date(Date.now() - WEBHOOK_STALE_THRESHOLD_MINUTES * 60_000)

    try {
        const [releasedClerk, releasedStripe] = await prisma.$transaction([
            prisma.clerkWebhookEvent.updateMany({
                where: {
                    status: 'processing',
                    processedAt: {
                        lt: staleCutoff,
                    },
                },
                data: {
                    status: 'failed',
                    processedAt: new Date(),
                    error: 'Processing lock released by platform admin.',
                },
            }),
            prisma.stripeWebhookEvent.updateMany({
                where: {
                    status: 'processing',
                    processedAt: {
                        lt: staleCutoff,
                    },
                },
                data: {
                    status: 'failed',
                    processedAt: new Date(),
                    error: 'Processing lock released by platform admin.',
                },
            }),
        ])

        await writeOperationalAuditLog({
            userId: session.userId,
            action: 'PLATFORM_WEBHOOK_STALE_LOCKS_CLEARED',
            resourceType: 'WebhookEvent',
            resourceId: 'platform:webhook-locks',
            details: {
                staleCutoff: staleCutoff.toISOString(),
                clerkAffectedCount: releasedClerk.count,
                stripeAffectedCount: releasedStripe.count,
            },
        })

        revalidatePlatformPaths()

        return {
            affectedCount: releasedClerk.count + releasedStripe.count,
            clerkAffectedCount: releasedClerk.count,
            stripeAffectedCount: releasedStripe.count,
        }
    } catch (error: unknown) {
        await observability.captureException(error, { action: 'clearStuckWebhookProcessingEvents' })
        throw error
    }
}

export async function cleanupStaleWebhookLocks(): Promise<WebhookMutationResultDTO> {
    return await clearStuckWebhookProcessingEvents()
}

export async function replayStripeWebhookFailures(rawInput: {
    eventIds: string[]
}): Promise<WebhookReplayResultDTO> {
    const session = await requirePlatformDeveloperAdmin()

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const input = replayWebhookFailuresSchema.parse(rawInput)
    const failedEvents = await prisma.stripeWebhookEvent.findMany({
        where: {
            id: { in: input.eventIds },
            status: 'failed',
        },
        select: { id: true, type: true, payload: true },
    })

    const failedEventMap = new Map(failedEvents.map((event) => [event.id, event]))
    let replayedCount = 0
    let ignoredCount = 0
    let nonReplayableCount = 0
    let failedCount = 0
    const failedIds: string[] = []
    const ignoredIds: string[] = []
    const nonReplayableIds: string[] = []

    for (const eventId of input.eventIds) {
        const event = failedEventMap.get(eventId)

        if (!event) {
            failedCount += 1
            failedIds.push(eventId)
            continue
        }

        const storedEvent = getStoredStripeEvent(event.payload, event.id, event.type)
        if (!storedEvent) {
            nonReplayableCount += 1
            nonReplayableIds.push(event.id)
            continue
        }

        try {
            const result = await processStripeWebhookEvent({
                event: storedEvent,
                payload: event.payload as unknown as Prisma.InputJsonValue,
            })

            if (result.kind === 'ignored') {
                ignoredCount += 1
                ignoredIds.push(event.id)
                continue
            }

            replayedCount += 1
        } catch {
            failedCount += 1
            failedIds.push(event.id)
        }
    }

    await writeOperationalAuditLog({
        userId: session.userId,
        action: 'PLATFORM_STRIPE_WEBHOOK_REPLAY_REQUESTED',
        resourceType: 'StripeWebhookEvent',
        resourceId: input.eventIds.join(','),
        details: {
            requestedIds: input.eventIds,
            replayedCount,
            ignoredCount,
            nonReplayableCount,
            failedCount,
            ignoredIds,
            nonReplayableIds,
            failedIds,
        },
    })

    revalidatePlatformPaths()

    return {
        requestedCount: input.eventIds.length,
        replayedCount,
        ignoredCount,
        nonReplayableCount,
        failedCount,
    }
}

export async function resetFailedWebhookLocks(rawInput: {
    source: 'clerk' | 'stripe'
    eventIds: string[]
}): Promise<WebhookMutationResultDTO> {
    const session = await requirePlatformDeveloperAdmin()

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const input = resetWebhookLocksSchema.parse(rawInput as ResetWebhookLocksInput)

    if (input.source === 'clerk') {
        throw new Error(
            'Clerk replay remains owned by auth/authz and is not available from platform.'
        )
    }

    const result = await replayStripeWebhookFailures({ eventIds: input.eventIds })

    return {
        affectedCount: result.replayedCount + result.ignoredCount,
        clerkAffectedCount: 0,
        stripeAffectedCount: result.replayedCount + result.ignoredCount,
    }
}

export { writeOperationalAuditLog }
