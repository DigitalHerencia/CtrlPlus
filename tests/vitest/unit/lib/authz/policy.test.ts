import { describe, expect, it } from 'vitest'

import {
    canAccessCustomerOwnedResource,
    hasCapability,
    requireCapability,
    requireCustomerOwnedResourceAccess,
    requireOwnerOrAdmin,
    requirePlatformAdmin,
} from '@/lib/authz/policy'
import type { AuthzContext } from '@/types/auth.types'

function makeContext(overrides: Partial<AuthzContext> = {}): AuthzContext {
    return {
        userId: 'customer-1',
        role: 'customer',
        isAuthenticated: true,
        isOwner: false,
        isPlatformAdmin: false,
        ...overrides,
    }
}

describe('authz policy', () => {
    it('denies capabilities for unauthenticated contexts', () => {
        const context = makeContext({ isAuthenticated: false, userId: null })

        expect(hasCapability(context, 'billing.read.own')).toBe(false)
    })

    it('allows owner/admin capabilities from the role matrix', () => {
        const owner = makeContext({ role: 'owner', isOwner: true })

        expect(hasCapability(owner, 'billing.write.all')).toBe(true)
    })

    it('throws Unauthorized when requiring capability without auth context', () => {
        const context = makeContext({ isAuthenticated: false, userId: null })

        expect(() => requireCapability(context, 'catalog.read')).toThrow(
            'Unauthorized: not authenticated'
        )
    })

    it('throws Forbidden when capability is missing', () => {
        const context = makeContext({ role: 'customer' })

        expect(() => requireCapability(context, 'billing.write.all')).toThrow(
            'Forbidden: insufficient permissions'
        )
    })

    it('permits resource access for owners/admins and matching customers', () => {
        const owner = makeContext({ role: 'owner', isOwner: true })
        const platformAdmin = makeContext({ role: 'admin', isPlatformAdmin: true })
        const customer = makeContext({ userId: 'customer-1', role: 'customer' })
        const otherCustomer = makeContext({ userId: 'customer-2', role: 'customer' })

        expect(canAccessCustomerOwnedResource(owner, 'customer-9')).toBe(true)
        expect(canAccessCustomerOwnedResource(platformAdmin, 'customer-9')).toBe(true)
        expect(canAccessCustomerOwnedResource(customer, 'customer-1')).toBe(true)
        expect(canAccessCustomerOwnedResource(otherCustomer, 'customer-1')).toBe(false)
    })

    it('enforces customer-owned resource access', () => {
        const context = makeContext({ userId: 'customer-2', role: 'customer' })

        expect(() => requireCustomerOwnedResourceAccess(context, 'customer-1')).toThrow(
            'Forbidden: resource is not accessible'
        )
        expect(() => requireCustomerOwnedResourceAccess(context, 'customer-2')).not.toThrow()
    })

    it('requires owner/admin and platform-admin guards correctly', () => {
        const customer = makeContext({ role: 'customer' })
        const owner = makeContext({ role: 'owner', isOwner: true })
        const admin = makeContext({ role: 'admin', isPlatformAdmin: true })

        expect(() => requireOwnerOrAdmin(customer)).toThrow('Forbidden: owner or admin role required')
        expect(() => requireOwnerOrAdmin(owner)).not.toThrow()
        expect(() => requirePlatformAdmin(owner)).toThrow('Forbidden: admin role required')
        expect(() => requirePlatformAdmin(admin)).not.toThrow()
    })
})
