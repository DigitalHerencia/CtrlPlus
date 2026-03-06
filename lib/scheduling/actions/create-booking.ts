"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ─── Input validation schema ──────────────────────────────────────────────────

const createBookingSchema = z
  .object({
    wrapId: z.string().min(1, "Wrap is required"),
    startTime: z.coerce.date({ required_error: "Start time is required" }),
    endTime: z.coerce.date({ required_error: "End time is required" }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert a Date to an "HH:MM" string in local time for comparison against AvailabilityRule times. */
function toHHMM(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

// ─── Server action ────────────────────────────────────────────────────────────

/**
 * Creates a booking for the current authenticated user.
 *
 * Security pipeline:
 *  1. Authenticate  – verify the user is logged in
 *  2. Authorize     – verify the user is a tenant member
 *  3. Validate      – parse and validate input with Zod
 *  4. Availability  – verify the slot falls within an AvailabilityRule and has capacity
 *  5. Mutate        – create the booking scoped to the tenant
 *  6. Audit         – log the creation
 */
export async function createBooking(input: CreateBookingInput): Promise<CreatedBookingDTO> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  await assertTenantMembership(tenantId, user.id, "member");

  // Step 3: VALIDATE
  const parsed = createBookingSchema.parse(input);

  // Step 4: AVAILABILITY CHECK (server-side, cannot be bypassed via direct action calls)
  // 4a. Find a matching AvailabilityRule for the day and time range
  const dayOfWeek = parsed.startTime.getDay(); // 0=Sun … 6=Sat
  const startHHMM = toHHMM(parsed.startTime);
  const endHHMM = toHHMM(parsed.endTime);

  const matchingRule = await prisma.availabilityRule.findFirst({
    where: {
      tenantId,
      dayOfWeek,
      startTime: startHHMM,
      endTime: endHHMM,
      deletedAt: null,
    },
    select: { id: true, capacitySlots: true },
  });

  if (!matchingRule) {
    throw new Error(
      "The requested time slot is not within a configured availability window for this tenant",
    );
  }

  // 4b. Count existing non-cancelled bookings that overlap this time window
  const overlappingCount = await prisma.booking.count({
    where: {
      tenantId,
      deletedAt: null,
      status: { notIn: ["cancelled"] },
      startTime: { lt: parsed.endTime },
      endTime: { gt: parsed.startTime },
    },
  });

  if (overlappingCount >= matchingRule.capacitySlots) {
    throw new Error("The requested time slot is fully booked — no remaining capacity");
  }

  // Step 5: MUTATE
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

  // Step 6: AUDIT
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
