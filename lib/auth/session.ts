import { resolveGlobalRoleForClerkUserId } from '@/lib/auth/identity'
import { type AuthzContext } from '@/types/authz'
import { type Session, type SessionContext, type SessionUser } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'

/**
 * Resolves the current authenticated user and authorization role from Clerk.
 */
export const getSession = cache(async (): Promise<SessionContext> => {
    const { userId: clerkUserId } = await auth()
    const isAuthenticated = Boolean(clerkUserId)
    const resolvedClerkUserId = clerkUserId ?? null
    const role =
        resolvedClerkUserId && isAuthenticated
            ? await resolveGlobalRoleForClerkUserId(resolvedClerkUserId)
            : 'customer'

    const authz: AuthzContext = {
        userId: resolvedClerkUserId,
        role,
        isAuthenticated,
        isOwner: role === 'owner',
        isPlatformAdmin: role === 'admin',
    }

    return {
        userId: resolvedClerkUserId,
        isAuthenticated,
        authz,
        role: authz.role,
        isOwner: authz.isOwner,
        isPlatformAdmin: authz.isPlatformAdmin,
    }
})

/**
 * Requires the current user to be authenticated.
 * Throws an error if not authenticated.
 *
 * Use this in server actions and protected API routes to enforce authentication.
 *
 * @returns SessionContext guaranteed to have a non-null userId
 * @throws Error if not authenticated
 *
 * @example
 * ```typescript
 * export async function createWrap(input: CreateWrapInput) {
 *   const { userId } = await requireAuth();
 *   // ...
 * }
 * ```
 */
export async function requireAuth(): Promise<SessionContext & { userId: string }> {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    return session as SessionContext & { userId: string }
}

export type { Session, SessionContext, SessionUser }
