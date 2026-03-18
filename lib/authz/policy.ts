import { type AuthzContext, type Capability, type GlobalRole } from './types'

const ROLE_CAPABILITIES: Record<GlobalRole, Set<Capability>> = {
    customer: new Set<Capability>([
        'catalog.read',
        'visualizer.use',
        'scheduling.read.own',
        'scheduling.write.own',
        'billing.read.own',
        'billing.write.own',
        'settings.manage.own',
    ]),
    owner: new Set<Capability>([
        'catalog.read',
        'catalog.manage',
        'visualizer.use',
        'scheduling.read.own',
        'scheduling.read.all',
        'scheduling.write.own',
        'scheduling.write.all',
        'billing.read.own',
        'billing.read.all',
        'billing.write.own',
        'billing.write.all',
        'settings.manage.own',
        'dashboard.owner',
    ]),
    admin: new Set<Capability>([
        'catalog.read',
        'catalog.manage',
        'visualizer.use',
        'visualizer.manage',
        'scheduling.read.own',
        'scheduling.read.all',
        'scheduling.write.own',
        'scheduling.write.all',
        'billing.read.own',
        'billing.read.all',
        'billing.write.own',
        'billing.write.all',
        'settings.manage.own',
        'dashboard.owner',
        'dashboard.platform',
        'platform.webhook.ops',
        'platform.database.ops',
    ]),
}

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
