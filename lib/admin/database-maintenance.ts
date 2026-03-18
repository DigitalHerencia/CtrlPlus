import { prisma } from '@/lib/prisma'

export const EXPIRED_PREVIEW_RETENTION_DAYS = 7
export const WEBHOOK_EVENT_RETENTION_DAYS = 30

export interface DatabaseMaintenanceInput {
    now?: Date
}

export interface DatabaseMaintenanceResult {
    deletedPreviewCount: number
    deletedClerkWebhookEventCount: number
    deletedStripeWebhookEventCount: number
}

export async function pruneDatabaseArtifacts(
    input: DatabaseMaintenanceInput = {}
): Promise<DatabaseMaintenanceResult> {
    const now = input.now ?? new Date()
    const previewCutoff = new Date(
        now.getTime() - EXPIRED_PREVIEW_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )
    const webhookCutoff = new Date(
        now.getTime() - WEBHOOK_EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )

    const [deletedPreviews, deletedClerkWebhookEvents, deletedStripeWebhookEvents] =
        await prisma.$transaction([
            prisma.visualizerPreview.deleteMany({
                where: {
                    expiresAt: { lt: previewCutoff },
                },
            }),
            prisma.clerkWebhookEvent.deleteMany({
                where: {
                    status: { in: ['processed', 'failed'] },
                    processedAt: { lt: webhookCutoff },
                },
            }),
            prisma.stripeWebhookEvent.deleteMany({
                where: {
                    status: { in: ['processed', 'failed'] },
                    processedAt: { lt: webhookCutoff },
                },
            }),
        ])

    return {
        deletedPreviewCount: deletedPreviews.count,
        deletedClerkWebhookEventCount: deletedClerkWebhookEvents.count,
        deletedStripeWebhookEventCount: deletedStripeWebhookEvents.count,
    }
}
