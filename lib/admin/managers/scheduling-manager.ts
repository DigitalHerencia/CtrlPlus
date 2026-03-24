import { prisma } from '@/lib/prisma'

export type ConfirmAppointmentParams = {
    tenantId: string
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
    note?: string | null
}

/**
 * Scheduling manager - orchestrates scheduling-related server operations for admin flows.
 * Keep logic small: call Prisma scoped to tenant and return minimal payloads.
 */
export const confirmAppointment = async (params: ConfirmAppointmentParams) => {
    const { tenantId, bookingId, status, note } = params

    const booking = await prisma.booking.updateMany({
        where: { id: bookingId, deletedAt: null },
        data: { status, updatedAt: new Date() },
    })

    // Return a minimal result matching admin expectations
    return { bookingId, updatedCount: booking.count }
}
