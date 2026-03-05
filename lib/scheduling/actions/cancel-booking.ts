"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  cancelBookingSchema,
  type CancelBookingInput,
  type BookingDTO,
  type BookingStatus,
} from "../types";

/**
 * Cancels an existing booking and records an audit trail entry.
 *
 * Security pipeline:
 * 1. Authenticate  → verify session
 * 2. Authorize     → MEMBER role or above
 * 3. Validate      → Zod schema
 * 4. Ownership     → booking must belong to the tenant
 * 5. State check   → only non-cancelled/completed bookings can be cancelled
 * 6. Mutate        → update status to CANCELLED
 * 7. Audit         → log cancellation with reason
 */
export async function cancelBooking(
  input: CancelBookingInput
): Promise<BookingDTO> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  await assertTenantMembership(tenantId, user.id, "MEMBER");

  // Step 3: VALIDATE
  const parsed = cancelBookingSchema.parse(input);

  // Step 4: OWNERSHIP — booking must belong to this tenant
  const existing = await prisma.booking.findFirst({
    where: { id: parsed.bookingId, tenantId },
  });

  if (!existing) {
    throw new Error("Forbidden: booking not found");
  }

  // Step 5: STATE CHECK — only cancellable statuses
  const nonCancellableStatuses: BookingStatus[] = ["CANCELLED", "COMPLETED"];
  if (nonCancellableStatuses.includes(existing.status as BookingStatus)) {
    throw new Error(`Cannot cancel a booking with status "${existing.status}"`);
  }

  // Step 6: MUTATE
  const booking = await prisma.booking.update({
    where: { id: parsed.bookingId },
    data: { status: "CANCELLED" },
  });

  // Step 7: AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "BOOKING_CANCELLED",
      resourceId: booking.id,
      details: {
        previousStatus: existing.status,
        reason: parsed.reason ?? null,
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
