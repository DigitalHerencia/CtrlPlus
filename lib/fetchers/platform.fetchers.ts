import 'server-only'

import { prisma } from '@/lib/prisma'
import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import type {
    WebhookFailureDTO,
    WebhookOperationsOverviewDTO,
    WebhookSource,
    PlatformStatusOverviewDTO,
} from '@/types/platform'

const STALE_THRESHOLD_MINUTES = 5
const RECENT_FAILURE_LIMIT = 25

function toFailureDTO(
    source: WebhookSource,
    record: {
        id: string
        type: string
        status: string
        processedAt: Date
        error: string | null
        payload: unknown
    }
): WebhookFailureDTO {
    const canReplay = source === 'stripe' && record.payload !== null

    return {
        id: record.id,
        source,
        type: record.type,
        status: record.status,
        processedAt: record.processedAt.toISOString(),
        error: record.error,
        canReplay,
        replayUnavailableReason: canReplay
            ? null
            : source === 'clerk'
              ? 'Clerk replay stays owned by auth/authz and is not available from platform.'
              : 'Stored payload unavailable for replay.',
    }
}

export async function getWebhookOperationsOverview(): Promise<WebhookOperationsOverviewDTO> {
    await requirePlatformDeveloperAdmin()

    const staleCutoff = new Date(Date.now() - STALE_THRESHOLD_MINUTES * 60_000)

    const [
        clerkProcessed,
        clerkFailed,
        clerkProcessing,
        clerkStaleProcessing,
        clerkRecentFailures,
        stripeProcessed,
        stripeFailed,
        stripeProcessing,
        stripeStaleProcessing,
        stripeRecentFailures,
    ] = await Promise.all([
        prisma.clerkWebhookEvent.count({ where: { status: 'processed' } }),
        prisma.clerkWebhookEvent.count({ where: { status: 'failed' } }),
        prisma.clerkWebhookEvent.count({ where: { status: 'processing' } }),
        prisma.clerkWebhookEvent.count({
            where: { status: 'processing', processedAt: { lt: staleCutoff } },
        }),
        prisma.clerkWebhookEvent.findMany({
            where: { status: 'failed' },
            select: {
                id: true,
                type: true,
                status: true,
                processedAt: true,
                error: true,
                payload: true,
            },
            orderBy: { processedAt: 'desc' },
            take: RECENT_FAILURE_LIMIT,
        }),
        prisma.stripeWebhookEvent.count({ where: { status: 'processed' } }),
        prisma.stripeWebhookEvent.count({ where: { status: 'failed' } }),
        prisma.stripeWebhookEvent.count({ where: { status: 'processing' } }),
        prisma.stripeWebhookEvent.count({
            where: { status: 'processing', processedAt: { lt: staleCutoff } },
        }),
        prisma.stripeWebhookEvent.findMany({
            where: { status: 'failed' },
            select: {
                id: true,
                type: true,
                status: true,
                processedAt: true,
                error: true,
                payload: true,
            },
            orderBy: { processedAt: 'desc' },
            take: RECENT_FAILURE_LIMIT,
        }),
    ])

    const clerkFailures = clerkRecentFailures.map((record) => toFailureDTO('clerk', record))
    const stripeFailures = stripeRecentFailures.map((record) => toFailureDTO('stripe', record))

    return {
        generatedAt: new Date().toISOString(),
        staleThresholdMinutes: STALE_THRESHOLD_MINUTES,
        clerk: {
            processed: clerkProcessed,
            failed: clerkFailed,
            processing: clerkProcessing,
            staleProcessing: clerkStaleProcessing,
            recentFailures: clerkFailures,
            replayableRecentFailures: 0,
            nonReplayableRecentFailures: clerkFailures.length,
        },
        stripe: {
            processed: stripeProcessed,
            failed: stripeFailed,
            processing: stripeProcessing,
            staleProcessing: stripeStaleProcessing,
            recentFailures: stripeFailures,
            replayableRecentFailures: stripeFailures.filter((failure) => failure.canReplay).length,
            nonReplayableRecentFailures: stripeFailures.filter((failure) => !failure.canReplay)
                .length,
        },
    }
}

export async function getPlatformStatusOverview(): Promise<PlatformStatusOverviewDTO> {
    await requirePlatformDeveloperAdmin()

    const [versionResult, activeUsers, activeBookings, activeInvoices, activeWraps] =
        await Promise.all([
            prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`,
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.booking.count({ where: { deletedAt: null } }),
            prisma.invoice.count({ where: { deletedAt: null } }),
            prisma.wrap.count({ where: { deletedAt: null } }),
        ])

    return {
        generatedAt: new Date().toISOString(),
        databaseVersion: versionResult[0]?.version ?? 'Unknown',
        activeUsers,
        activeBookings,
        activeInvoices,
        activeWraps,
    }
}
