'use server'

import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { createAdminInvoice } from '@/lib/db/transactions/billing.transactions'
import { confirmAdminAppointment } from '@/lib/db/transactions/scheduling.transactions'
import {
    confirmAppointmentSchema,
    createInvoiceSchema,
    flagContentSchema,
    resolveFlagSchema,
} from '@/schemas/admin.schemas'
import type {
    ConfirmAppointmentInput,
    CreateInvoiceInput,
    FlagContentInput,
    ResolveFlagInput,
} from '@/types/admin.types'
import { revalidateAdminPaths } from '@/lib/cache/revalidate-tags'

function createFlagId(): string {
    return `flag_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`
}

async function requireAdminActor() {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized')
    }

    await requireOwnerOrPlatformAdmin()

    return session.userId
}

export async function flagContent(rawInput: unknown): Promise<{ flagId: string }> {
    const userId = await requireAdminActor()

    const input = flagContentSchema.parse(rawInput as FlagContentInput)
    const flagId = createFlagId()

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'admin.flagContent',
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            details: JSON.stringify({
                tenantId: input.tenantId,
                flagId,
                reason: input.reason,
                summary: `Flagged ${input.resourceType} for review`,
            }),
            timestamp: new Date(),
        },
    })

    revalidateAdminPaths()

    return { flagId }
}

export async function resolveFlag(rawInput: unknown): Promise<{ resolved: boolean }> {
    const userId = await requireAdminActor()

    const input = resolveFlagSchema.parse(rawInput as ResolveFlagInput)

    const flagLog = await prisma.auditLog.findFirst({
        where: {
            action: 'admin.flagContent',
            details: {
                contains: input.flagId,
            },
        },
        orderBy: { timestamp: 'desc' },
    })

    if (!flagLog) {
        throw new Error('Flag not found')
    }

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'admin.resolveFlag',
            resourceType: flagLog.resourceType,
            resourceId: flagLog.resourceId,
            details: JSON.stringify({
                tenantId: input.tenantId,
                flagId: input.flagId,
                resolution: input.action,
                summary: `Resolved flag ${input.flagId} as ${input.action}`,
            }),
            timestamp: new Date(),
        },
    })

    revalidateAdminPaths()

    return { resolved: true }
}

export async function createInvoice(input: CreateInvoiceInput) {
    const userId = await requireAdminActor()

    const parsed = createInvoiceSchema.parse(input)

    const result = await createAdminInvoice(prisma, {
        bookingId: parsed.bookingId,
        amountCents: parsed.amountCents,
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'admin.createInvoice',
            resourceType: 'Invoice',
            resourceId: result.invoiceId,
            details: JSON.stringify({ tenantId: parsed.tenantId, invoiceResult: result }),
            timestamp: new Date(),
        },
    })

    return result
}

export async function confirmAppointment(input: ConfirmAppointmentInput) {
    const userId = await requireAdminActor()

    const parsed = confirmAppointmentSchema.parse(input)

    const result = await confirmAdminAppointment(prisma, {
        bookingId: parsed.bookingId,
        status: parsed.status,
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'admin.confirmAppointment',
            resourceType: 'Booking',
            resourceId: parsed.bookingId,
            details: JSON.stringify({ tenantId: parsed.tenantId, status: parsed.status }),
            timestamp: new Date(),
        },
    })

    return result
}
