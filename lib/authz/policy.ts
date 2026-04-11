/**
 * @introduction Authz — TODO: short one-line summary of policy.ts
 *
 * @description TODO: longer description for policy.ts. Keep it short — one or two sentences.
 * Domain: authz
 * Public: TODO (yes/no)
 */
import { type AuthzContext, type Capability } from '@/types/auth.types'
import { ROLE_CAPABILITIES } from '@/lib/authz/capabilities'

/**
 * hasCapability — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function hasCapability(context: AuthzContext, capability: Capability): boolean {
    if (!context.isAuthenticated) {
        return false
    }

    return ROLE_CAPABILITIES[context.role]?.has(capability) ?? false
}

/**
 * requireCapability — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function requireCapability(context: AuthzContext, capability: Capability): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!hasCapability(context, capability)) {
        throw new Error('Forbidden: insufficient permissions')
    }
}

/**
 * requireOwnerOrAdmin — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function requireOwnerOrAdmin(context: AuthzContext): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!context.isOwner && !context.isPlatformAdmin) {
        throw new Error('Forbidden: owner or admin role required')
    }
}

/**
 * requirePlatformAdmin — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function requirePlatformAdmin(context: AuthzContext): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!context.isPlatformAdmin) {
        throw new Error('Forbidden: admin role required')
    }
}

/**
 * canAccessCustomerOwnedResource — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function canAccessCustomerOwnedResource(context: AuthzContext, customerId: string): boolean {
    if (!context.userId) {
        return false
    }

    if (context.isOwner || context.isPlatformAdmin) {
        return true
    }

    return context.userId === customerId
}

/**
 * requireCustomerOwnedResourceAccess — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
