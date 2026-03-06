"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  updateBookingSchema,
  type UpdateBookingInput,
  type BookingActionDTO,
  BOOKING_STATUS,
} from "../types";

/**
 * Reschedules an existing booking to a new time slot after re-validating
 * time-slot availability (excluding the current booking from the count).
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Tenant scope  — confirm the booking belongs to the current tenant
 * 5. Availability  — check capacity for the new time slot
 * 6. Mutate        — update startTime / endTime scoped to tenantId
 * 7. Audit         — write an immutable audit log entry
 */
export async function updateBooking(
  bookingId: string,
  input: UpdateBookingInput,
): Promise<BookingActionDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member may reschedule a booking
  await assertTenantMembership(tenantId, user.id, "member");

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

  // 5. AVAILABILITY CHECK for the new time slot
  //    a) Find rules for the requested day-of-week
  const dayOfWeek = startTime.getDay(); // 0 = Sunday … 6 = Saturday
  const rules = await prisma.availabilityRule.findMany({
    where: { tenantId, dayOfWeek, deletedAt: null },
    select: { capacitySlots: true },
  });

  if (rules.length === 0) {
    throw new Error("No availability configured for the requested day");
  }

  const maxCapacity = Math.max(...rules.map((r) => r.capacitySlots));

  //    b) Count overlapping bookings, excluding the booking being rescheduled
  const overlappingCount = await prisma.booking.count({
    where: {
      tenantId,
      deletedAt: null,
      status: { not: BOOKING_STATUS.CANCELLED },
      id: { not: bookingId },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (overlappingCount >= maxCapacity) {
    throw new Error("No available slots for the requested time");
  }

  // 6. MUTATE — update time slot scoped by tenantId
  const booking = await prisma.booking.update({
    where: { id: bookingId, tenantId },
    data: { startTime, endTime },
  });

  // 7. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "UPDATE_BOOKING",
      resourceType: "Booking",
      resourceId: booking.id,
      details: JSON.stringify({
        previousStartTime: existing.startTime.toISOString(),
        previousEndTime: existing.endTime.toISOString(),
        newStartTime: startTime.toISOString(),
        newEndTime: endTime.toISOString(),
      }),
      timestamp: new Date(),
    },
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
