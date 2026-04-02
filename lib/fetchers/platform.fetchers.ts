import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import { getCloudinaryCredentials } from '@/lib/integrations/cloudinary'
import { visualizerConfig } from '@/lib/integrations/huggingface'
import { observability } from '@/lib/integrations/observability'
import { getStripeClient } from '@/lib/integrations/stripe'
import { RECENT_WEBHOOK_FAILURE_LIMIT, WEBHOOK_STALE_THRESHOLD_MINUTES } from '@/lib/constants/app'
import type {
    DependencyHealthDTO,
    PlatformDashboardDTO,
    PlatformHealthDTO,
    PlatformHealthStatus,
    PlatformIncidentDTO,
    PlatformToolCardDTO,
    WebhookFailureDTO,
    WebhookOperationsOverviewDTO,
    WebhookSource,
    PlatformStatusOverviewDTO,
} from '@/types/platform.types'

interface DependencyCheckResult {
    status: PlatformHealthStatus
    message: string | null
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs)
        }),
    ])
}

function deriveOverallStatus(dependencies: DependencyHealthDTO[]): PlatformHealthStatus {
    if (dependencies.some((dependency) => dependency.status === 'down')) {
        return 'down'
    }

    if (dependencies.some((dependency) => dependency.status === 'degraded')) {
        return 'degraded'
    }

    return 'healthy'
}

async function runDependencyCheck(
    name: string,
    timeoutMs: number,
    check: () => Promise<DependencyCheckResult>
): Promise<DependencyHealthDTO> {
    const startedAt = Date.now()

    try {
        const result = await withTimeout(check(), timeoutMs)

        return {
            name,
            status: result.status,
            message: result.message,
            responseTimeMs: Date.now() - startedAt,
            updatedAt: new Date().toISOString(),
        }
    } catch (error: unknown) {
        await observability.captureSoftFailure('Dependency health check failed', {
            dependency: name,
            timeoutMs,
            error: error instanceof Error ? error.message : String(error),
        })

        return {
            name,
            status: 'down',
            message: 'Dependency check failed or timed out.',
            responseTimeMs: Date.now() - startedAt,
            updatedAt: new Date().toISOString(),
        }
    }
}

async function checkDatabaseDependency(): Promise<DependencyCheckResult> {
    await prisma.$queryRaw`SELECT 1`
    return {
        status: 'healthy',
        message: null,
    }
}

async function checkStripeDependency(): Promise<DependencyCheckResult> {
    try {
        const stripe = getStripeClient()
        await stripe.balance.retrieve()
        return {
            status: 'healthy',
            message: null,
        }
    } catch (error: unknown) {
        return {
            status: 'degraded',
            message: error instanceof Error ? error.message : 'Stripe unavailable',
        }
    }
}

async function checkCloudinaryDependency(): Promise<DependencyCheckResult> {
    const credentials = getCloudinaryCredentials()

    if (!credentials) {
        return {
            status: 'degraded',
            message: 'Cloudinary credentials are not configured.',
        }
    }

    return {
        status: 'healthy',
        message: null,
    }
}

async function checkHuggingFaceDependency(): Promise<DependencyCheckResult> {
    if (!visualizerConfig.huggingFaceToken) {
        return {
            status: 'degraded',
            message: 'Hugging Face token is not configured.',
        }
    }

    return {
        status: 'healthy',
        message: null,
    }
}

async function checkClerkDependency(): Promise<DependencyCheckResult> {
    const clerkSecret = process.env.CLERK_SECRET_KEY?.trim()

    if (!clerkSecret) {
        return {
            status: 'degraded',
            message: 'Clerk secret key is not configured.',
        }
    }

    return {
        status: 'healthy',
        message: null,
    }
}

export async function getDependencyHealth(): Promise<DependencyHealthDTO[]> {
    return await Promise.all([
        runDependencyCheck('database', 2_000, checkDatabaseDependency),
        runDependencyCheck('stripe', 3_000, checkStripeDependency),
        runDependencyCheck('cloudinary', 1_500, checkCloudinaryDependency),
        runDependencyCheck('huggingface', 1_500, checkHuggingFaceDependency),
        runDependencyCheck('clerk', 1_500, checkClerkDependency),
    ])
}

export async function getPlatformHealthOverview(): Promise<PlatformHealthDTO> {
    const dependencies = await getDependencyHealth()
    const status = deriveOverallStatus(dependencies)

    return {
        status,
        services: Object.fromEntries(
            dependencies.map((dependency) => [dependency.name, dependency.status])
        ),
        updatedAt: new Date().toISOString(),
    }
}

async function getPlatformRecentIncidents(limit = 10): Promise<PlatformIncidentDTO[]> {
    const [clerkFailures, stripeFailures] = await Promise.all([
        prisma.clerkWebhookEvent.findMany({
            where: { status: 'failed' },
            orderBy: { processedAt: 'desc' },
            take: limit,
            select: {
                id: true,
                type: true,
                error: true,
                processedAt: true,
            },
        }),
        prisma.stripeWebhookEvent.findMany({
            where: { status: 'failed' },
            orderBy: { processedAt: 'desc' },
            take: limit,
            select: {
                id: true,
                type: true,
                error: true,
                processedAt: true,
            },
        }),
    ])

    return [...clerkFailures, ...stripeFailures]
        .sort((left, right) => right.processedAt.getTime() - left.processedAt.getTime())
        .slice(0, limit)
        .map((failure) => ({
            id: failure.id,
            severity: 'error',
            title: failure.type,
            message: failure.error ?? 'Operational failure recorded.',
            createdAt: failure.processedAt.toISOString(),
            source: 'webhook',
        }))
}

function getPlatformMaintenanceTools(): PlatformToolCardDTO[] {
    return [
        {
            id: 'cleanup-stale-webhook-locks',
            title: 'Cleanup stale webhook locks',
            description: 'Release stale webhook processing locks for recovery.',
            actionKey: 'cleanup-stale-webhook-locks',
        },
        {
            id: 'replay-stripe-webhook-failures',
            title: 'Replay Stripe webhook failures',
            description: 'Retry replayable failed Stripe webhook events.',
            actionKey: 'replay-stripe-webhook-failures',
        },
        {
            id: 'prune-visualizer-previews',
            title: 'Prune visualizer previews',
            description: 'Clean stale visualizer preview records and assets.',
            actionKey: 'prune-visualizer-previews',
        },
    ]
}

export async function getPlatformDashboard(): Promise<PlatformDashboardDTO> {
    await requirePlatformDeveloperAdmin()

    const [dependencies, recentIncidents] = await Promise.all([
        getDependencyHealth(),
        getPlatformRecentIncidents(),
    ])

    return {
        overallStatus: deriveOverallStatus(dependencies),
        dependencies,
        recentIncidents,
        maintenanceTools: getPlatformMaintenanceTools(),
        updatedAt: new Date().toISOString(),
    }
}

export async function getWebhookMonitorState(): Promise<WebhookOperationsOverviewDTO> {
    return await getWebhookOperationsOverview()
}

export async function getPlatformJobToolsState(): Promise<PlatformToolCardDTO[]> {
    await requirePlatformDeveloperAdmin()

    return [
        {
            id: 'jobs-clear-stale-webhook-locks',
            title: 'Clear stale webhook locks',
            description: 'Release stale webhook processing rows for controlled replay.',
            actionKey: 'cleanup-stale-webhook-locks',
        },
        {
            id: 'jobs-replay-stripe-webhooks',
            title: 'Replay Stripe webhook failures',
            description: 'Replay bounded Stripe webhook event IDs with stored payloads.',
            actionKey: 'replay-stripe-webhook-failures',
        },
    ]
}

export async function getPlatformDbToolsState(): Promise<PlatformToolCardDTO[]> {
    await requirePlatformDeveloperAdmin()

    return [
        {
            id: 'db-health-check',
            title: 'Database health check',
            description: 'Inspect current database connectivity and status.',
            actionKey: null,
        },
    ]
}

export async function getPlatformVisualizerToolsState(): Promise<PlatformToolCardDTO[]> {
    await requirePlatformDeveloperAdmin()

    return [
        {
            id: 'visualizer-prune-previews',
            title: 'Prune visualizer previews',
            description: 'Clean stale visualizer previews based on retention threshold.',
            actionKey: 'prune-visualizer-previews',
        },
    ]
}

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

    const staleCutoff = new Date(Date.now() - WEBHOOK_STALE_THRESHOLD_MINUTES * 60_000)

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
            take: RECENT_WEBHOOK_FAILURE_LIMIT,
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
            take: RECENT_WEBHOOK_FAILURE_LIMIT,
        }),
    ])

    const clerkFailures = clerkRecentFailures.map((record) => toFailureDTO('clerk', record))
    const stripeFailures = stripeRecentFailures.map((record) => toFailureDTO('stripe', record))

    return {
        generatedAt: new Date().toISOString(),
        staleThresholdMinutes: WEBHOOK_STALE_THRESHOLD_MINUTES,
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
