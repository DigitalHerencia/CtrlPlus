import 'server-only'

import type { Prisma } from '@prisma/client'

import { type SessionContext, requireAuth } from '@/lib/auth/session'
import { canAccessCustomerOwnedResource, hasCapability } from '@/lib/authz/policy'

import { type InvoiceStatus, isInvoicePayable } from './types'

export interface BillingAccessContext {
    session: SessionContext & { userId: string }
    canReadAllInvoices: boolean
    canWriteAllInvoices: boolean
}

export async function getBillingAccessContext(): Promise<BillingAccessContext> {
    const session = await requireAuth()
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
        session,
        canReadAllInvoices,
        canWriteAllInvoices,
    }
}

export async function requireBillingReadContext(): Promise<{
    userId: string
    canReadAllInvoices: boolean
}> {
    const access = await getBillingAccessContext()
    const canReadOwnInvoices =
        access.canReadAllInvoices || hasCapability(access.session.authz, 'billing.read.own')

    if (!canReadOwnInvoices) {
        throw new Error('Forbidden: insufficient billing permissions')
    }

    return {
        userId: access.session.userId,
        canReadAllInvoices: access.canReadAllInvoices,
    }
}

export async function requireBillingWriteContext(): Promise<{
    userId: string
    canWriteAllInvoices: boolean
}> {
    const access = await getBillingAccessContext()
    const canWriteOwnInvoices =
        access.canWriteAllInvoices || hasCapability(access.session.authz, 'billing.write.own')

    if (!canWriteOwnInvoices) {
        throw new Error('Forbidden: insufficient billing permissions')
    }

    return {
        userId: access.session.userId,
        canWriteAllInvoices: access.canWriteAllInvoices,
    }
}

export function buildInvoiceReadWhere(
    userId: string,
    canAccessAllInvoices: boolean
): Prisma.InvoiceWhereInput {
    if (canAccessAllInvoices) {
        return {}
    }

    return {
        booking: {
            customerId: userId,
        },
    }
}

export function canAccessCustomerInvoice(
    customerId: string,
    userId: string,
    canAccessAllInvoices: boolean
): boolean {
    return canAccessAllInvoices || customerId === userId
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

export function isInvoiceCheckoutEligible(status: string): status is InvoiceStatus {
    return isInvoicePayable(status as InvoiceStatus)
}
