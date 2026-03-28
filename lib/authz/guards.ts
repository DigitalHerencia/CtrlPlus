import { getSession } from '@/lib/auth/session'
import {
    canAccessCustomerOwnedResource,
    hasCapability,
    requireCapability,
    requireCustomerOwnedResourceAccess,
    requireOwnerOrAdmin,
    requirePlatformAdmin,
} from './policy'
import { type Capability } from '@/types/authz'
import { type SessionContext } from '@/types/auth'

export interface BillingAccessContext {
    session: SessionContext & { userId: string }
    canReadAllInvoices: boolean
    canWriteAllInvoices: boolean
}

export async function requireAuthzCapability(capability: Capability) {
    const session = await getSession()
    requireCapability(session.authz, capability)
    return session
}

export async function requireOwnerOrPlatformAdmin() {
    const session = await getSession()
    requireOwnerOrAdmin(session.authz)
    return session
}

export async function requirePlatformDeveloperAdmin() {
    const session = await getSession()
    requirePlatformAdmin(session.authz)
    return session
}

export async function requireCustomerResourceAccess(customerId: string) {
    const session = await getSession()
    requireCustomerOwnedResourceAccess(session.authz, customerId)
    return session
}

export async function getBillingAccessContext(): Promise<BillingAccessContext> {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const canReadAllInvoices = hasCapability(session.authz, 'billing.read.all')
    const canReadOwnInvoices =
        canReadAllInvoices || hasCapability(session.authz, 'billing.read.own')
    const canWriteAllInvoices = hasCapability(session.authz, 'billing.write.all')
    const canWriteOwnInvoices =
        canWriteAllInvoices || hasCapability(session.authz, 'billing.write.own')

    if (!canReadOwnInvoices && !canWriteOwnInvoices) {
        throw new Error('Forbidden: insufficient billing permissions')
    }

    return {
        session: session as SessionContext & { userId: string },
        canReadAllInvoices,
        canWriteAllInvoices,
    }
}

export function requireInvoiceWriteAccess(
    access: BillingAccessContext,
    customerId: string
): void {
    const canWriteOwnInvoices =
        access.canWriteAllInvoices || hasCapability(access.session.authz, 'billing.write.own')

    if (!canWriteOwnInvoices) {
        throw new Error('Forbidden: insufficient billing permissions')
    }

    if (
        !canAccessCustomerOwnedResource(access.session.authz, customerId) &&
        !access.canWriteAllInvoices
    ) {
        throw new Error('Forbidden: user cannot pay this invoice')
    }
}
