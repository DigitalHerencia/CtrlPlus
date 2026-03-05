"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { hasBookingConflict } from "../fetchers/get-bookings";
import {
  updateBookingSchema,
  type UpdateBookingInput,
  type BookingDTO,
  type BookingStatus,
} from "../types";

/**
 * Updates an existing booking (rescheduling or status change) with audit trail.
 *
 * Security pipeline:
 * 1. Authenticate  → verify session
 * 2. Authorize     → ADMIN or OWNER for status changes; MEMBER for reschedule
 * 3. Validate      → Zod schema
 * 4. Ownership     → booking must belong to the tenant
 * 5. State check   → cannot update cancelled/completed bookings
 * 6. Conflict check → no overlapping bookings when rescheduling
 * 7. Mutate        → update booking
 * 8. Audit         → log update with before/after snapshot
 */
export async function updateBooking(
  input: UpdateBookingInput
): Promise<BookingDTO> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  // Status transitions require at least ADMIN; rescheduling requires MEMBER.
  // Inspect raw input (before full Zod validation) only to determine role requirement.
  const isStatusChange =
    typeof input === "object" &&
    input !== null &&
    "status" in input &&
    input.status !== undefined;

  if (isStatusChange) {
    await assertTenantMembership(tenantId, user.id, "ADMIN");
  } else {
    await assertTenantMembership(tenantId, user.id, "MEMBER");
  }

  // Step 3: VALIDATE
  const parsed = updateBookingSchema.parse(input);

  // Step 4: OWNERSHIP — booking must belong to this tenant
  const existing = await prisma.booking.findFirst({
    where: { id: parsed.bookingId, tenantId },
  });

  if (!existing) {
    throw new Error("Forbidden: booking not found");
  }

  // Step 5: STATE CHECK — cannot modify terminal-state bookings
  const terminalStatuses: BookingStatus[] = ["CANCELLED", "COMPLETED"];
  if (terminalStatuses.includes(existing.status as BookingStatus)) {
    throw new Error(`Cannot update a booking with status "${existing.status}"`);
  }

  // Step 6: CONFLICT CHECK — only when rescheduling time windows
  const isRescheduling =
    parsed.dropOffStart !== undefined ||
    parsed.dropOffEnd !== undefined ||
    parsed.pickUpStart !== undefined ||
    parsed.pickUpEnd !== undefined;

  if (isRescheduling) {
    const newDropOffStart = parsed.dropOffStart ?? existing.dropOffStart;
    const newPickUpEnd = parsed.pickUpEnd ?? existing.pickUpEnd;

    const conflict = await hasBookingConflict(
      tenantId,
      newDropOffStart,
      newPickUpEnd,
      parsed.bookingId
    );

    if (conflict) {
      throw new Error(
        "Slot unavailable: a booking already exists for the requested time window"
      );
    }
  }

  // Step 6: MUTATE
  const booking = await prisma.booking.update({
    where: { id: parsed.bookingId },
    data: {
      ...(parsed.dropOffStart !== undefined && {
        dropOffStart: parsed.dropOffStart,
      }),
      ...(parsed.dropOffEnd !== undefined && {
        dropOffEnd: parsed.dropOffEnd,
      }),
      ...(parsed.pickUpStart !== undefined && {
        pickUpStart: parsed.pickUpStart,
      }),
      ...(parsed.pickUpEnd !== undefined && { pickUpEnd: parsed.pickUpEnd }),
      ...(parsed.status !== undefined && { status: parsed.status }),
      ...(parsed.notes !== undefined && { notes: parsed.notes }),
    },
  });

  // Step 7: AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "BOOKING_UPDATED",
      resourceId: booking.id,
      details: {
        before: {
          status: existing.status,
          dropOffStart: existing.dropOffStart.toISOString(),
          pickUpEnd: existing.pickUpEnd.toISOString(),
        },
        after: {
          status: booking.status,
          dropOffStart: booking.dropOffStart.toISOString(),
          pickUpEnd: booking.pickUpEnd.toISOString(),
        },
        changedFields: Object.keys(parsed).filter(
          (k) =>
            k !== "bookingId" && parsed[k as keyof typeof parsed] !== undefined
        ),
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
