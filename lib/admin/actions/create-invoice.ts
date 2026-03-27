import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { createInvoice as managerCreateInvoice } from '@/lib/admin/managers/billing-manager'
import { createInvoiceSchema } from '@/schema/admin'
import { type CreateInvoiceInput } from '@/types/admin'

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
