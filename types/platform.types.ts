export interface WebhookStatusCountsDTO {
    processed: number
    failed: number
    processing: number
}

export type WebhookSource = 'clerk' | 'stripe'
export type PlatformProvider = WebhookSource | 'database' | 'cloudinary' | 'huggingface'
export type PlatformHealthStatus = 'healthy' | 'degraded' | 'down'
export type PlatformIncidentSeverity = 'info' | 'warning' | 'error'

import type { Timestamp } from './common.types'

export interface PlatformHealthDTO {
    status: PlatformHealthStatus
    services: Record<string, string>
    updatedAt: Timestamp
}

export interface DependencyHealthDTO {
    name: string
    status: PlatformHealthStatus
    message: string | null
    responseTimeMs: number | null
    updatedAt: Timestamp
}

export interface PlatformWebhookStatusDTO {
    provider: WebhookSource | 'other'
    failedCount: number
    staleLockCount: number
    lastProcessedAt: Timestamp | null
}

export interface PlatformActionResultDTO {
    success: boolean
    action: string
    message: string
    affectedCount: number | null
    executedAt: Timestamp
}

export interface PlatformIncidentDTO {
    id: string
    severity: PlatformIncidentSeverity
    title: string
    message: string
    createdAt: Timestamp
    source: string | null
}

export interface PlatformToolCardDTO {
    id: string
    title: string
    description: string | null
    actionKey: string | null
}

export interface PlatformDashboardDTO {
    overallStatus: PlatformHealthStatus
    dependencies: DependencyHealthDTO[]
    recentIncidents: PlatformIncidentDTO[]
    maintenanceTools: PlatformToolCardDTO[]
    updatedAt: Timestamp
}

export interface PlatformStatusOverviewDTO {
    generatedAt: Timestamp
    databaseVersion: string
    activeUsers: number
    activeBookings: number
    activeInvoices: number
    activeWraps: number
}

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

export interface WebhookProviderOverviewDTO extends WebhookStatusCountsDTO {
    staleProcessing: number
    recentFailures: WebhookFailureDTO[]
    replayableRecentFailures: number
    nonReplayableRecentFailures: number
}

export interface WebhookOperationsOverviewDTO {
    generatedAt: Timestamp
    staleThresholdMinutes: number
    clerk: WebhookProviderOverviewDTO
    stripe: WebhookProviderOverviewDTO
}

export interface WebhookMutationResultDTO {
    affectedCount: number
    clerkAffectedCount: number
    stripeAffectedCount: number
}

export interface WebhookReplayResultDTO {
    requestedCount: number
    replayedCount: number
    ignoredCount: number
    nonReplayableCount: number
    failedCount: number
}

export interface ResetWebhookLocksInput {
    source: WebhookSource
    eventIds: string[]
}
