"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ─── Input validation schema ──────────────────────────────────────────────────

const createBookingSchema = z.object({
  wrapId: z.string().min(1, "Wrap is required"),
  startTime: z.coerce.date({ required_error: "Start time is required" }),
  endTime: z.coerce.date({ required_error: "End time is required" }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ─── Result DTO ───────────────────────────────────────────────────────────────

export interface CreatedBookingDTO {
  id: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  totalPrice: number;
}

// ─── Server action ────────────────────────────────────────────────────────────

/**
 * Creates a booking for the current authenticated user.
 *
 * Security pipeline:
 *  1. Authenticate  – verify the user is logged in
 *  2. Authorize     – verify the user is a tenant member
 *  3. Validate      – parse and validate input with Zod
 *  4. Mutate        – create the booking scoped to the tenant
 *  5. Audit         – log the creation
 */
export async function createBooking(input: CreateBookingInput): Promise<CreatedBookingDTO> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  await assertTenantMembership(tenantId, user.id, "member");

  // Step 3: VALIDATE
  const parsed = createBookingSchema.parse(input);

  if (parsed.endTime <= parsed.startTime) {
    throw new Error("End time must be after start time");
  }

  // Step 4: MUTATE
  // Look up wrap to get price (scoped to tenant)
  const wrap = await prisma.wrap.findFirst({
    where: { id: parsed.wrapId, tenantId, deletedAt: null },
    select: { id: true, price: true },
  });

  if (!wrap) {
    throw new Error("Wrap not found or does not belong to this tenant");
  }

  const booking = await prisma.booking.create({
    data: {
      tenantId,
      customerId: user.id,
      wrapId: parsed.wrapId,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
      status: "pending",
      totalPrice: wrap.price,
    },
    select: {
      id: true,
      wrapId: true,
      startTime: true,
      endTime: true,
      status: true,
      totalPrice: true,
    },
  });

  // Step 5: AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "CREATE_BOOKING",
      resourceType: "Booking",
      resourceId: booking.id,
      details: JSON.stringify({
        wrapId: booking.wrapId,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
      }),
      timestamp: new Date(),
    },
  });

  return {
    id: booking.id,
    wrapId: booking.wrapId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    totalPrice: booking.totalPrice,
  };
}
