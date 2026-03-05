"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { hasBookingConflict } from "../fetchers/get-bookings";
import {
  createBookingSchema,
  type CreateBookingInput,
  type BookingDTO,
  type BookingStatus,
} from "../types";

/**
 * Creates a new booking with conflict/slot validation.
 *
 * Security pipeline:
 * 1. Authenticate  → verify session
 * 2. Authorize     → MEMBER role or above
 * 3. Validate      → Zod schema + time-range sanity
 * 4. Conflict check → no overlapping bookings
 * 5. Mutate        → create booking scoped by tenantId
 * 6. Audit         → log booking creation
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<BookingDTO> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  await assertTenantMembership(tenantId, user.id, "MEMBER");

  // Step 3: VALIDATE
  const parsed = createBookingSchema.parse(input);

  // Step 4: CONFLICT CHECK — no overlapping active bookings for the same wrap
  const conflict = await hasBookingConflict(
    tenantId,
    parsed.dropOffStart,
    parsed.pickUpEnd
  );

  if (conflict) {
    throw new Error(
      "Slot unavailable: a booking already exists for the requested time window"
    );
  }

  // Step 5: MUTATE — always scope by tenantId
  const booking = await prisma.booking.create({
    data: {
      tenantId,
      customerId: parsed.customerId,
      wrapId: parsed.wrapId,
      dropOffStart: parsed.dropOffStart,
      dropOffEnd: parsed.dropOffEnd,
      pickUpStart: parsed.pickUpStart,
      pickUpEnd: parsed.pickUpEnd,
      notes: parsed.notes,
      status: "PENDING",
    },
  });

  // Step 6: AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "BOOKING_CREATED",
      resourceId: booking.id,
      details: {
        customerId: parsed.customerId,
        wrapId: parsed.wrapId,
        dropOffStart: parsed.dropOffStart.toISOString(),
        pickUpEnd: parsed.pickUpEnd.toISOString(),
      },
      timestamp: new Date(),
    },
  });

  return {
    id: booking.id,
    tenantId: booking.tenantId,
    customerId: booking.customerId,
    wrapId: booking.wrapId,
    dropOffStart: booking.dropOffStart,
    dropOffEnd: booking.dropOffEnd,
    pickUpStart: booking.pickUpStart,
    pickUpEnd: booking.pickUpEnd,
    status: booking.status as BookingStatus,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
