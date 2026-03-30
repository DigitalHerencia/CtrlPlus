import { prisma } from '@/lib/db/prisma'

export async function releaseStaleWebhookProcessingLocks(staleCutoff: Date) {
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

    return {
        clerkAffectedCount: releasedClerk.count,
        stripeAffectedCount: releasedStripe.count,
        affectedCount: releasedClerk.count + releasedStripe.count,
    }
}
