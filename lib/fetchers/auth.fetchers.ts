import "server-only"
import { prisma } from '@/lib/db/prisma'

/**
 * Read-only helpers for the auth domain.
 * Keep these server-only and import them from server components or server actions.
 */

export async function getUserByClerkUserId(clerkUserId: string) {
    const user = await prisma.user.findFirst({
        where: { clerkUserId, deletedAt: null },
        select: { id: true, clerkUserId: true, globalRole: true, createdAt: true, updatedAt: true },
    })
    if (!user) return null
    return { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() }
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, clerkUserId: true, globalRole: true, createdAt: true, updatedAt: true },
    })
    if (!user) return null
    return { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() }
}

export async function getUserRoleByClerkId(clerkUserId: string) {
    const user = await prisma.user.findFirst({ where: { clerkUserId, deletedAt: null }, select: { globalRole: true } })
    return user?.globalRole ?? null
}
