/**
 * @introduction Db — TODO: short one-line summary of scheduling.transactions.ts
 *
 * @description TODO: longer description for scheduling.transactions.ts. Keep it short — one or two sentences.
 * Domain: db
 * Public: TODO (yes/no)
 */
import type { Prisma, PrismaClient } from '@prisma/client'

import { toHHmm } from '@/lib/utils/dates'

type SchedulingWriter = PrismaClient | Prisma.TransactionClient

/**
 * SlotRange — TODO: brief description of this type.
 */
export interface SlotRange {
    startTime: Date
    endTime: Date
}

/**
 * AssertSlotCapacityInput — TODO: brief description of this type.
 */
export interface AssertSlotCapacityInput extends SlotRange {
    excludeBookingId?: string
    now?: Date
}

/**
 * ConfirmAdminAppointmentParams — TODO: brief description of this type.
 */
export interface ConfirmAdminAppointmentParams {
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
}

function getDayOfWeekUtc(date: Date): number {
    return date.getUTCDay()
}

async function getMaxCapacityForSlot(
    tx: Prisma.TransactionClient,
    range: SlotRange
): Promise<number> {
    const dayOfWeek = getDayOfWeekUtc(range.startTime)
    const slotStartHHmm = toHHmm(range.startTime)
    const slotEndHHmm = toHHmm(range.endTime)

    const rules = await tx.availabilityRule.findMany({
        where: { dayOfWeek, deletedAt: null },
        select: { startTime: true, endTime: true, capacitySlots: true },
    })

    if (rules.length === 0) {
        throw new Error('No availability configured for the requested day')
    }

    const matchingRules = rules.filter(
        (rule) => rule.startTime <= slotStartHHmm && rule.endTime >= slotEndHHmm
    )

    if (matchingRules.length === 0) {
        throw new Error('No availability configured for the requested time window')
    }

    return Math.max(...matchingRules.map((rule) => rule.capacitySlots))
}

async function countOverlappingActiveBookings(
    tx: Prisma.TransactionClient,
    input: AssertSlotCapacityInput
): Promise<number> {
    const effectiveNow = input.now ?? new Date()

    return tx.booking.count({
        where: {
            deletedAt: null,
            id: input.excludeBookingId ? { not: input.excludeBookingId } : undefined,
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
            OR: [
                { status: 'confirmed' },
                { status: 'completed' },
                {
                    status: 'pending',
                    reservation: {
                        is: {
                            expiresAt: { gt: effectiveNow },
                        },
                    },
                },
            ],
        },
    })
}

export async function assertSlotHasCapacity(
    tx: Prisma.TransactionClient,
    input: AssertSlotCapacityInput
): Promise<void> {
    const maxCapacity = await getMaxCapacityForSlot(tx, input)
    const overlappingCount = await countOverlappingActiveBookings(tx, input)

    if (overlappingCount >= maxCapacity) {
        throw new Error('The requested time slot is fully booked - no remaining capacity')
    }
}

export async function confirmAdminAppointment(
    db: SchedulingWriter,
    params: ConfirmAdminAppointmentParams
): Promise<{ bookingId: string; updatedCount: number }> {
    const booking = await db.booking.updateMany({
        where: { id: params.bookingId, deletedAt: null },
        data: { status: params.status, updatedAt: new Date() },
    })

    return {
        bookingId: params.bookingId,
        updatedCount: booking.count,
    }
}
