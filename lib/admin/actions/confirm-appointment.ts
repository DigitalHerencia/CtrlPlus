import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { confirmAppointment as managerConfirmAppointment } from '@/lib/admin/managers/scheduling-manager'
import { confirmAppointmentSchema } from '@/schema/admin'
import { type ConfirmAppointmentInput } from '@/types/admin'

export async function confirmAppointment(input: ConfirmAppointmentInput) {
    const parsed = confirmAppointmentSchema.parse(input)

    // ensure authenticated and authorized
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized')
    }

    // require owner (or platform admin) to run admin actions
    await requireOwnerOrPlatformAdmin()

    // perform the update via manager (keeps admin manager as single place for scheduling orchestration)
    const result = await managerConfirmAppointment({
        tenantId: parsed.tenantId,
        bookingId: parsed.bookingId,
        status: parsed.status,
        note: parsed.note ?? null,
    })

    // audit log entry
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
