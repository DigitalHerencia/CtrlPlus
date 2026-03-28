'use server'

import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { confirmAppointment as managerConfirmAppointment } from '@/lib/admin/managers/scheduling-manager'
import { createInvoice as managerCreateInvoice } from '@/lib/admin/managers/billing-manager'
import { createInvoiceSchema, confirmAppointmentSchema } from '@/schema/admin'
import type { CreateInvoiceInput, ConfirmAppointmentInput } from '@/types/admin'

export async function createInvoice(input: CreateInvoiceInput) {
    const parsed = createInvoiceSchema.parse(input)

    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) throw new Error('Unauthorized')

    await requireOwnerOrPlatformAdmin()

    const result = await managerCreateInvoice({
        tenantId: parsed.tenantId,
        bookingId: parsed.bookingId,
        customerId: parsed.customerId ?? null,
        amountCents: parsed.amountCents,
        currency: parsed.currency ?? 'usd',
        description: parsed.description ?? null,
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'admin.createInvoice',
            resourceType: 'Invoice',
            resourceId: result.invoiceId,
            details: JSON.stringify({ tenantId: parsed.tenantId, invoiceResult: result }),
        },
    })

    return result
}

export async function confirmAppointment(input: ConfirmAppointmentInput) {
    const parsed = confirmAppointmentSchema.parse(input)

    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized')
    }

    await requireOwnerOrPlatformAdmin()

    const result = await managerConfirmAppointment({
        tenantId: parsed.tenantId,
        bookingId: parsed.bookingId,
        status: parsed.status,
        note: parsed.note ?? null,
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'admin.confirmAppointment',
            resourceType: 'Booking',
            resourceId: parsed.bookingId,
            details: JSON.stringify({ tenantId: parsed.tenantId, status: parsed.status }),
        },
    })

    return result
}
