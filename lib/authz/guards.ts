import { getSession } from '@/lib/auth/session'
import {
    requireCapability,
    requireCustomerOwnedResourceAccess,
    requireOwnerOrAdmin,
    requirePlatformAdmin,
} from './policy'
import { type Capability } from '@/types/authz'

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
