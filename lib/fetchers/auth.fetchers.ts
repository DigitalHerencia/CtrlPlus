import { prisma } from '@/lib/db/prisma'

/**
 * Read-only helpers for the auth domain.
 * Keep these server-only and import them from server components or server actions.
 */

export async function getUserByClerkUserId(clerkUserId: string) {
    return prisma.user.findFirst({ where: { clerkUserId, deletedAt: null } })
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } })
}

export async function getUserRoleByClerkId(clerkUserId: string) {
    const user = await prisma.user.findFirst({
        where: { clerkUserId, deletedAt: null },
        select: { globalRole: true },
    })
    return user?.globalRole ?? null
}
