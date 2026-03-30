'use server'

import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { createAdminInvoice } from '@/lib/db/transactions/billing.transactions'
import { confirmAdminAppointment } from '@/lib/db/transactions/scheduling.transactions'
import { createInvoiceSchema, confirmAppointmentSchema } from '@/schemas/admin.schemas'
import type { CreateInvoiceInput, ConfirmAppointmentInput } from '@/types/admin.types'

export async function createInvoice(input: CreateInvoiceInput) {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) throw new Error('Unauthorized')

    await requireOwnerOrPlatformAdmin()

    const parsed = createInvoiceSchema.parse(input)

    const result = await createAdminInvoice(prisma, {
        bookingId: parsed.bookingId,
        amountCents: parsed.amountCents,
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
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized')
    }

    await requireOwnerOrPlatformAdmin()

    const parsed = confirmAppointmentSchema.parse(input)

    const result = await confirmAdminAppointment(prisma, {
        bookingId: parsed.bookingId,
        status: parsed.status,
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
