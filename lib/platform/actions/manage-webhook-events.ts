'use server'

import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { type WebhookMutationResultDTO } from '../types'

const resetWebhookLocksSchema = z.object({
    source: z.enum(['clerk', 'stripe']),
    eventIds: z.array(z.string().min(1)).min(1).max(100),
})

const SOURCE_TO_TABLE = {
    clerk: 'clerk',
    stripe: 'stripe',
} as const

export async function clearStuckWebhookProcessingEvents(): Promise<WebhookMutationResultDTO> {
    await requirePlatformDeveloperAdmin()

    const staleCutoff = new Date(Date.now() - 5 * 60_000)

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
            },
        }),
    ])

    revalidatePath('/platform')

    return {
        affectedCount: releasedClerk.count + releasedStripe.count,
    }
}

export async function resetFailedWebhookLocks(rawInput: {
    source: 'clerk' | 'stripe'
    eventIds: string[]
}): Promise<WebhookMutationResultDTO> {
    await requirePlatformDeveloperAdmin()

    const input = resetWebhookLocksSchema.parse(rawInput)
    const where = {
        id: {
            in: input.eventIds,
        },
        status: {
            in: ['failed', 'processing'],
        },
    }

    const now = new Date()
    const result =
        SOURCE_TO_TABLE[input.source] === 'clerk'
            ? await prisma.clerkWebhookEvent.updateMany({
                  where,
                  data: {
                      status: 'failed',
                      processedAt: now,
                  },
              })
            : await prisma.stripeWebhookEvent.updateMany({
                  where,
                  data: {
                      status: 'failed',
                      processedAt: now,
                  },
              })

    revalidatePath('/platform')

    return {
        affectedCount: result.count,
    }
}
