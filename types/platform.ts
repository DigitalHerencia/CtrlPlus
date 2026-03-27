export interface WebhookStatusCountsDTO {
    processed: number
    failed: number
    processing: number
}

export type WebhookSource = 'clerk' | 'stripe'

export interface WebhookFailureDTO {
    id: string
    source: WebhookSource
    type: string
    status: string
    processedAt: string
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
    generatedAt: string
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
