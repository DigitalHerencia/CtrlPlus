"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { toHHmm } from "../utils";
import { z } from "zod";

const updateBookingSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
});

type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

type BookingActionDTO = {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Reschedules an existing booking to a new time slot after re-validating
 * time-slot availability (excluding the current booking from the count).
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Tenant scope  — confirm the booking belongs to the current tenant
 * 5. Availability  — check capacity for the new time slot (atomic)
 * 6. Mutate        — update startTime / endTime scoped to tenantId (atomic)
 * 7. Audit         — write an immutable audit log entry (atomic)
 */
export async function updateBooking(
  bookingId: string,
  input: UpdateBookingInput,
): Promise<BookingActionDTO> {
  // 1. AUTHENTICATE
  const { tenantId } = await getSession();
  if (!tenantId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member may reschedule a booking
  await assertTenantMembership(tenantId, tenantId);

  // 3. VALIDATE
  const parsed = updateBookingSchema.parse(input);
  const { startTime, endTime } = parsed;

  // 4. TENANT SCOPE — defensive ownership check before mutation
  const existing = await prisma.booking.findFirst({
    where: { id: bookingId, tenantId, deletedAt: null },
    select: {
      id: true,
      tenantId: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  // 5 + 6 + 7. AVAILABILITY CHECK + MUTATE + AUDIT — performed atomically
  const dayOfWeek = startTime.getDay(); // 0 = Sunday … 6 = Saturday
  const slotStartHHmm = toHHmm(startTime);
  const slotEndHHmm = toHHmm(endTime);

  const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 5a. Find rules for the requested day-of-week and time window
    const rules = await tx.availabilityRule.findMany({
      where: { tenantId, dayOfWeek, deletedAt: null },
      select: { startTime: true, endTime: true, capacitySlots: true },
    });

    if (rules.length === 0) {
      throw new Error("No availability configured for the requested day");
    }

    // 5b. Filter to rules whose window fully covers the requested slot
    const matchingRules = rules.filter(
      (rule: { startTime: string; endTime: string; capacitySlots: number }) =>
        rule.startTime <= slotStartHHmm && rule.endTime >= slotEndHHmm,
    );

    if (matchingRules.length === 0) {
      throw new Error("No availability configured for the requested time window");
    }

    const maxCapacity = Math.max(
      ...matchingRules.map((r: { capacitySlots: number }) => r.capacitySlots),
    );

    // 5c. Count overlapping bookings, excluding the booking being rescheduled
    const overlappingCount = await tx.booking.count({
      where: {
        tenantId,
        deletedAt: null,
        status: { not: "CANCELLED" },
        id: { not: bookingId },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlappingCount >= maxCapacity) {
      throw new Error("No available slots for the requested time");
    }

    // 6. MUTATE — update time slot scoped by tenantId
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId, tenantId },
      data: { startTime, endTime },
    });

    // 7. AUDIT
    await tx.auditLog.create({
      data: {
        tenantId,
        userId: tenantId,
        action: "UPDATE_BOOKING",
        resourceType: "Booking",
        resourceId: updatedBooking.id,
        details: JSON.stringify({
          previousStartTime: existing.startTime.toISOString(),
          previousEndTime: existing.endTime.toISOString(),
          newStartTime: startTime.toISOString(),
          newEndTime: endTime.toISOString(),
        }),
        timestamp: new Date(),
      },
    });

    return updatedBooking;
  });

  return {
    id: booking.id,
    tenantId: booking.tenantId,
    customerId: booking.customerId,
    wrapId: booking.wrapId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status as BookingActionDTO["status"],
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
