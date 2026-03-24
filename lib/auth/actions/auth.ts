/**
 * Server actions for auth/domain mutations.
 * Use "use server" in callers (server actions) and call these helpers from server components or API routes.
 */
import { prisma } from '@/lib/prisma'
import type { GlobalRole } from '@/lib/authz/types'

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
            imageUrl: imageUrl ?? null,
            globalRole: globalRole ?? undefined,
            deletedAt: null,
        },
    })
}
