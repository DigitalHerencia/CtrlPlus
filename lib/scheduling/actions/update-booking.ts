"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertSlotHasCapacity } from "@/lib/scheduling/capacity";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const updateBookingSchema = z
  .object({
    startTime: z.date(),
    endTime: z.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

type BookingActionDTO = {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
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
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member may reschedule a booking
  await assertTenantMembership(tenantId, userId);

  // 3. VALIDATE
  const parsed = updateBookingSchema.parse(input);
  const { startTime, endTime } = parsed;

  // 4. TENANT SCOPE — defensive ownership check before mutation
  const existing = await prisma.booking.findFirst({
    where: { id: bookingId, tenantId, deletedAt: null },
    select: {
      id: true,
      tenantId: true,
      customerId: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  if (!existing) {
    throw new Error("Forbidden: resource not found");
  }

  if (existing.customerId !== userId) {
    await assertTenantMembership(tenantId, userId);
  }

  // 5 + 6 + 7. AVAILABILITY CHECK + MUTATE + AUDIT — performed atomically
  const booking = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await assertSlotHasCapacity(tx, {
        tenantId,
        startTime,
        endTime,
        excludeBookingId: bookingId,
      });

      // 6. MUTATE — update time slot scoped by tenantId
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId, tenantId },
        data: { startTime, endTime },
      });

      // 7. AUDIT
      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
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
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

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
