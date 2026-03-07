"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { BookingStatus, type BookingDTO } from "@/lib/scheduling/types";
import { assertTenantMembership } from "@/lib/tenancy/assert";

/**
 * Cancels a booking by marking its status as "cancelled".
 * Only bookings that belong to the current tenant and have not already been
 * deleted may be cancelled.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Tenant scope  — confirm the booking belongs to the current tenant
 * 4. Mutate        — set status to "cancelled" and clear active reservation
 * 5. Audit         — write an immutable audit log entry
 */
export async function cancelBooking(bookingId: string): Promise<BookingDTO> {
  // 1. AUTHENTICATE
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member may cancel a booking
  await assertTenantMembership(tenantId, userId);

  // 3. TENANT SCOPE — defensive ownership check before mutation
  const existing = await prisma.booking.findFirst({
    where: { id: bookingId, tenantId, deletedAt: null },
    select: { id: true, tenantId: true, status: true },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  // 4 + 5. MUTATE + AUDIT
  const booking = await prisma.$transaction(async (tx) => {
    await tx.bookingReservation.deleteMany({ where: { bookingId } });

    const updated = await tx.booking.update({
      where: { id: bookingId, tenantId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    await tx.auditLog.create({
      data: {
        tenantId,
        userId,
        action: "CANCEL_BOOKING",
        resourceType: "Booking",
        resourceId: updated.id,
        details: JSON.stringify({ previousStatus: existing.status }),
        timestamp: new Date(),
      },
    });

    return updated;
  });

  return {
    id: booking.id,
    tenantId: booking.tenantId,
    customerId: booking.customerId,
    wrapId: booking.wrapId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status as BookingDTO["status"],
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
