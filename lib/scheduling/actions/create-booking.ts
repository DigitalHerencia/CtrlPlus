"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  createBookingSchema,
  type CreateBookingInput,
  type BookingActionDTO,
  BOOKING_STATUS,
} from "../types";

/**
 * Creates a new booking for the current tenant after validating time-slot
 * availability against the tenant's AvailabilityRule records.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Availability  — check capacity rules before creating
 * 5. Mutate        — create the booking scoped to tenantId
 * 6. Audit         — write an immutable audit log entry
 */
export async function createBooking(input: CreateBookingInput): Promise<BookingActionDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member may create a booking
  await assertTenantMembership(tenantId, user.id, "member");

  // 3. VALIDATE
  const parsed = createBookingSchema.parse(input);
  const { wrapId, startTime, endTime, totalPrice } = parsed;

  // 4. AVAILABILITY CHECK
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

  //    b) Count non-cancelled, non-deleted bookings that overlap [startTime, endTime)
  const overlappingCount = await prisma.booking.count({
    where: {
      tenantId,
      deletedAt: null,
      status: { not: BOOKING_STATUS.CANCELLED },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (overlappingCount >= maxCapacity) {
    throw new Error("No available slots for the requested time");
  }

  // 5. MUTATE — scoped by tenantId; customerId comes from the session
  const booking = await prisma.booking.create({
    data: {
      tenantId,
      customerId: user.id,
      wrapId,
      startTime,
      endTime,
      totalPrice,
      status: BOOKING_STATUS.PENDING,
    },
  });

  // 6. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "CREATE_BOOKING",
      resourceType: "Booking",
      resourceId: booking.id,
      details: JSON.stringify({
        wrapId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice,
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
