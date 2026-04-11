/**
 * @introduction Db — TODO: short one-line summary of auth-webhook.transactions.ts
 *
 * @description TODO: longer description for auth-webhook.transactions.ts. Keep it short — one or two sentences.
 * Domain: db
 * Public: TODO (yes/no)
 */
import type { Prisma, PrismaClient } from '@prisma/client'

type AuthWriter = PrismaClient | Prisma.TransactionClient

/**
 * HandleClerkUserDeleteParams — TODO: brief description of this type.
 */
export interface HandleClerkUserDeleteParams {
    clerkUserId: string
    email: string
}

/**
 * Safely delete all user data in a single transaction.
 * Marks user as deleted and sets deletedAt on all related records.
 */
export async function handleClerkUserDelete(
    db: AuthWriter,
    params: HandleClerkUserDeleteParams
): Promise<void> {
    const deletedAt = new Date()

    await (db as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.user.updateMany({
            where: { clerkUserId: params.clerkUserId },
            data: {
                email: `deleted+${params.clerkUserId}@local.invalid`,
                firstName: null,
                lastName: null,
                imageUrl: null,
                deletedAt,
            },
        })

        await Promise.all([
            tx.clerkSession.updateMany({
                where: { clerkUserId: params.clerkUserId, deletedAt: null },
                data: { deletedAt },
            }),
            tx.clerkEmail.updateMany({
                where: { clerkUserId: params.clerkUserId, deletedAt: null },
                data: { deletedAt },
            }),
            tx.clerkSms.updateMany({
                where: { clerkUserId: params.clerkUserId, deletedAt: null },
                data: { deletedAt },
            }),
            tx.clerkSubscription.updateMany({
                where: { clerkUserId: params.clerkUserId, deletedAt: null },
                data: { deletedAt },
            }),
            tx.clerkPaymentAttempt.updateMany({
                where: { clerkUserId: params.clerkUserId, deletedAt: null },
                data: { deletedAt },
            }),
        ])
    })
}
