'use server'

/**
 * Server actions for auth/domain mutations.
 * Call these helpers from server components, API routes, or other server actions.
 */
import { prisma } from '@/lib/db/prisma'
import type { GlobalRole } from '@/types/authz'

export async function upsertUserFromClerk(payload: {
    clerkUserId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    globalRole?: GlobalRole | null
}) {
    const { clerkUserId, email, firstName, lastName, imageUrl, globalRole } = payload

    return prisma.user.upsert({
        where: { clerkUserId },
        create: {
            clerkUserId,
            email,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            imageUrl: imageUrl ?? null,
            globalRole: globalRole ?? 'customer',
        },
        update: {
            email,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            imageUrl: imageUrl ?? undefined,
            globalRole: globalRole ?? undefined,
            deletedAt: null,
        },
    })
}
