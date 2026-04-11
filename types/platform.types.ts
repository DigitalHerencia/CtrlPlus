/**
 * WebhookStatusCountsDTO — TODO: brief description of this type.
 */
/**
 * WebhookStatusCountsDTO — TODO: brief description of this type.
 */
/**
 * WebhookStatusCountsDTO — TODO: brief description of this type.
 */
export interface WebhookStatusCountsDTO {
    processed: number
    failed: number
    processing: number
}

/**
 * WebhookSource — TODO: brief description of this type.
 */
/**
 * WebhookSource — TODO: brief description of this type.
 */
/**
 * WebhookSource — TODO: brief description of this type.
 */
export type WebhookSource = 'clerk' | 'stripe'
/**
 * PlatformProvider — TODO: brief description of this type.
 */
/**
 * PlatformProvider — TODO: brief description of this type.
 */
/**
 * PlatformProvider — TODO: brief description of this type.
 */
export type PlatformProvider = WebhookSource | 'database' | 'cloudinary' | 'huggingface'
/**
 * PlatformHealthStatus — TODO: brief description of this type.
 */
/**
 * PlatformHealthStatus — TODO: brief description of this type.
 */
/**
 * PlatformHealthStatus — TODO: brief description of this type.
 */
export type PlatformHealthStatus = 'healthy' | 'degraded' | 'down'
/**
 * PlatformIncidentSeverity — TODO: brief description of this type.
 */
/**
 * PlatformIncidentSeverity — TODO: brief description of this type.
 */
/**
 * PlatformIncidentSeverity — TODO: brief description of this type.
 */
export type PlatformIncidentSeverity = 'info' | 'warning' | 'error'

import type { Timestamp } from './common.types'

/**
 * PlatformHealthDTO — TODO: brief description of this type.
 */
/**
 * PlatformHealthDTO — TODO: brief description of this type.
 */
/**
 * PlatformHealthDTO — TODO: brief description of this type.
 */
export interface PlatformHealthDTO {
    status: PlatformHealthStatus
    services: Record<string, string>
    updatedAt: Timestamp
}

/**
 * DependencyHealthDTO — TODO: brief description of this type.
 */
/**
 * DependencyHealthDTO — TODO: brief description of this type.
 */
/**
 * DependencyHealthDTO — TODO: brief description of this type.
 */
export interface DependencyHealthDTO {
    name: string
    status: PlatformHealthStatus
    message: string | null
    responseTimeMs: number | null
    updatedAt: Timestamp
}

/**
 * PlatformWebhookStatusDTO — TODO: brief description of this type.
 */
/**
 * PlatformWebhookStatusDTO — TODO: brief description of this type.
 */
/**
 * PlatformWebhookStatusDTO — TODO: brief description of this type.
 */
export interface PlatformWebhookStatusDTO {
    provider: WebhookSource | 'other'
    failedCount: number
    staleLockCount: number
    lastProcessedAt: Timestamp | null
}

/**
 * PlatformActionResultDTO — TODO: brief description of this type.
 */
/**
 * PlatformActionResultDTO — TODO: brief description of this type.
 */
/**
 * PlatformActionResultDTO — TODO: brief description of this type.
 */
export interface PlatformActionResultDTO {
    success: boolean
    action: string
    message: string
    affectedCount: number | null
    executedAt: Timestamp
}

/**
 * PlatformIncidentDTO — TODO: brief description of this type.
 */
/**
 * PlatformIncidentDTO — TODO: brief description of this type.
 */
/**
 * PlatformIncidentDTO — TODO: brief description of this type.
 */
export interface PlatformIncidentDTO {
    id: string
    severity: PlatformIncidentSeverity
    title: string
    message: string
    createdAt: Timestamp
    source: string | null
}

/**
 * PlatformToolCardDTO — TODO: brief description of this type.
 */
/**
 * PlatformToolCardDTO — TODO: brief description of this type.
 */
/**
 * PlatformToolCardDTO — TODO: brief description of this type.
 */
export interface PlatformToolCardDTO {
    id: string
    title: string
    description: string | null
    actionKey: string | null
}

/**
 * PlatformDashboardDTO — TODO: brief description of this type.
 */
/**
 * PlatformDashboardDTO — TODO: brief description of this type.
 */
/**
 * PlatformDashboardDTO — TODO: brief description of this type.
 */
export interface PlatformDashboardDTO {
    overallStatus: PlatformHealthStatus
    dependencies: DependencyHealthDTO[]
    recentIncidents: PlatformIncidentDTO[]
    maintenanceTools: PlatformToolCardDTO[]
    updatedAt: Timestamp
}

/**
 * PlatformStatusOverviewDTO — TODO: brief description of this type.
 */
/**
 * PlatformStatusOverviewDTO — TODO: brief description of this type.
 */
/**
 * PlatformStatusOverviewDTO — TODO: brief description of this type.
 */
export interface PlatformStatusOverviewDTO {
    generatedAt: Timestamp
    databaseVersion: string
    activeUsers: number
    activeBookings: number
    activeInvoices: number
    activeWraps: number
}

/**
 * WebhookFailureDTO — TODO: brief description of this type.
 */
/**
 * WebhookFailureDTO — TODO: brief description of this type.
 */
/**
 * WebhookFailureDTO — TODO: brief description of this type.
 */
export interface WebhookFailureDTO {
    id: string
    source: WebhookSource
    type: string
    status: string
    processedAt: Timestamp
    error: string | null
    canReplay: boolean
    replayUnavailableReason: string | null
}

/**
 * WebhookProviderOverviewDTO — TODO: brief description of this type.
 */
/**
 * WebhookProviderOverviewDTO — TODO: brief description of this type.
 */
/**
 * WebhookProviderOverviewDTO — TODO: brief description of this type.
 */
export interface WebhookProviderOverviewDTO extends WebhookStatusCountsDTO {
    staleProcessing: number
    recentFailures: WebhookFailureDTO[]
    replayableRecentFailures: number
    nonReplayableRecentFailures: number
}

/**
 * WebhookOperationsOverviewDTO — TODO: brief description of this type.
 */
/**
 * WebhookOperationsOverviewDTO — TODO: brief description of this type.
 */
/**
 * WebhookOperationsOverviewDTO — TODO: brief description of this type.
 */
export interface WebhookOperationsOverviewDTO {
    generatedAt: Timestamp
    staleThresholdMinutes: number
    clerk: WebhookProviderOverviewDTO
    stripe: WebhookProviderOverviewDTO
}

/**
 * WebhookMutationResultDTO — TODO: brief description of this type.
 */
/**
 * WebhookMutationResultDTO — TODO: brief description of this type.
 */
/**
 * WebhookMutationResultDTO — TODO: brief description of this type.
 */
export interface WebhookMutationResultDTO {
    affectedCount: number
    clerkAffectedCount: number
    stripeAffectedCount: number
}

/**
 * WebhookReplayResultDTO — TODO: brief description of this type.
 */
/**
 * WebhookReplayResultDTO — TODO: brief description of this type.
 */
/**
 * WebhookReplayResultDTO — TODO: brief description of this type.
 */
export interface WebhookReplayResultDTO {
    requestedCount: number
    replayedCount: number
    ignoredCount: number
    nonReplayableCount: number
    failedCount: number
}

/**
 * ResetWebhookLocksInput — TODO: brief description of this type.
 */
/**
 * ResetWebhookLocksInput — TODO: brief description of this type.
 */
/**
 * ResetWebhookLocksInput — TODO: brief description of this type.
 */
export interface ResetWebhookLocksInput {
    source: WebhookSource
    eventIds: string[]
}
