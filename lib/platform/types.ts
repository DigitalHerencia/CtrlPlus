export interface WebhookStatusCountsDTO {
    processed: number
    failed: number
    processing: number
}

export interface WebhookFailureDTO {
    id: string
    type: string
    status: string
    processedAt: string
}

export interface WebhookOperationsOverviewDTO {
    generatedAt: string
    staleThresholdMinutes: number
    clerk: WebhookStatusCountsDTO & {
        staleProcessing: number
        recentFailures: WebhookFailureDTO[]
    }
    stripe: WebhookStatusCountsDTO & {
        staleProcessing: number
        recentFailures: WebhookFailureDTO[]
    }
}

export interface WebhookMutationResultDTO {
    affectedCount: number
}
