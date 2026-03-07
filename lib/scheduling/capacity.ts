import type { Prisma } from "@prisma/client";
import { toHHmm } from "@/lib/scheduling/utils";

export interface SlotRange {
  startTime: Date;
  endTime: Date;
}

export interface AssertSlotCapacityInput extends SlotRange {
  tenantId: string;
  excludeBookingId?: string;
  now?: Date;
}

function getDayOfWeekUtc(date: Date): number {
  return date.getUTCDay();
}

async function getMaxCapacityForSlot(
  tx: Prisma.TransactionClient,
  tenantId: string,
  range: SlotRange,
): Promise<number> {
  const dayOfWeek = getDayOfWeekUtc(range.startTime);
  const slotStartHHmm = toHHmm(range.startTime);
  const slotEndHHmm = toHHmm(range.endTime);

  const rules = await tx.availabilityRule.findMany({
    where: { tenantId, dayOfWeek, deletedAt: null },
    select: { startTime: true, endTime: true, capacitySlots: true },
  });

  if (rules.length === 0) {
    throw new Error("No availability configured for the requested day");
  }

  const matchingRules = rules.filter(
    (rule) => rule.startTime <= slotStartHHmm && rule.endTime >= slotEndHHmm,
  );

  if (matchingRules.length === 0) {
    throw new Error("No availability configured for the requested time window");
  }

  return Math.max(...matchingRules.map((rule) => rule.capacitySlots));
}

async function countOverlappingActiveBookings(
  tx: Prisma.TransactionClient,
  input: AssertSlotCapacityInput,
): Promise<number> {
  const effectiveNow = input.now ?? new Date();

  return tx.booking.count({
    where: {
      tenantId: input.tenantId,
      deletedAt: null,
      id: input.excludeBookingId ? { not: input.excludeBookingId } : undefined,
      startTime: { lt: input.endTime },
      endTime: { gt: input.startTime },
      OR: [
        { status: "confirmed" },
        { status: "completed" },
        {
          status: "pending",
          reservation: {
            is: {
              expiresAt: { gt: effectiveNow },
            },
          },
        },
      ],
    },
  });
}

/**
 * Verifies that a slot is covered by availability rules and has remaining
 * capacity for active bookings/reservations.
 */
export async function assertSlotHasCapacity(
  tx: Prisma.TransactionClient,
  input: AssertSlotCapacityInput,
): Promise<void> {
  const maxCapacity = await getMaxCapacityForSlot(tx, input.tenantId, input);
  const overlappingCount = await countOverlappingActiveBookings(tx, input);

  if (overlappingCount >= maxCapacity) {
    throw new Error("The requested time slot is fully booked — no remaining capacity");
  }
}
