import 'server-only'

import { getSession, type SessionContext } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

export async function requireSchedulingReadSession(): Promise<SessionContext> {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!hasCapability(session.authz, 'scheduling.read.own')) {
        throw new Error('Forbidden: insufficient permissions')
    }

    return session
}

export function canViewAllSchedulingBookings(session: SessionContext): boolean {
    return hasCapability(session.authz, 'scheduling.read.all')
}

export function resolveSchedulingBookingCustomerId(
    session: SessionContext,
    customerId?: string
): string | undefined {
    if (canViewAllSchedulingBookings(session)) {
        return undefined
    }

    return customerId ?? session.userId ?? undefined
}
