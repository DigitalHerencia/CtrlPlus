import { type AuthzContext, type Capability } from '@/types/authz'
import { ROLE_CAPABILITIES } from '@/lib/authz/capabilities'

export function hasCapability(context: AuthzContext, capability: Capability): boolean {
    if (!context.isAuthenticated) {
        return false
    }

    return ROLE_CAPABILITIES[context.role]?.has(capability) ?? false
}

export function requireCapability(context: AuthzContext, capability: Capability): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!hasCapability(context, capability)) {
        throw new Error('Forbidden: insufficient permissions')
    }
}

export function requireOwnerOrAdmin(context: AuthzContext): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!context.isOwner && !context.isPlatformAdmin) {
        throw new Error('Forbidden: owner or admin role required')
    }
}

export function requirePlatformAdmin(context: AuthzContext): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!context.isPlatformAdmin) {
        throw new Error('Forbidden: admin role required')
    }
}

export function canAccessCustomerOwnedResource(context: AuthzContext, customerId: string): boolean {
    if (!context.userId) {
        return false
    }

    if (context.isOwner || context.isPlatformAdmin) {
        return true
    }

    return context.userId === customerId
}

export function requireCustomerOwnedResourceAccess(
    context: AuthzContext,
    customerId: string
): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!canAccessCustomerOwnedResource(context, customerId)) {
        throw new Error('Forbidden: resource is not accessible')
    }
}
