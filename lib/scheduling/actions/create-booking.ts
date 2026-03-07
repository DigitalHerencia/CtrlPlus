"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { toHHmm } from "@/lib/scheduling/utils";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { ensureInvoiceForBooking } from "@/lib/billing/actions/ensure-invoice-for-booking";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

// ─── Input validation schema ──────────────────────────────────────────────────

const createBookingSchema = z
  .object({
    wrapId: z.string().min(1, "Wrap is required"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
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
  invoiceId: string;
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
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  await assertTenantMembership(tenantId, userId);

  // Step 3: VALIDATE
  const parsed = createBookingSchema.parse(input);

  // Step 4: AVAILABILITY CHECK (server-side, cannot be bypassed via direct action calls)
  // 4a. Find a matching AvailabilityRule for the day and time range
  const dayOfWeek = parsed.startTime.getDay(); // 0=Sun … 6=Sat
  const startHHmm = toHHmm(parsed.startTime);
  const endHHmm = toHHmm(parsed.endTime);

  const matchingRules = await prisma.availabilityRule.findMany({
    where: {
      tenantId,
      dayOfWeek,
      deletedAt: null,
    },
    select: { id: true, startTime: true, endTime: true, capacitySlots: true },
  });

  const matchingCapacity = matchingRules
    .filter((rule) => rule.startTime <= startHHmm && rule.endTime >= endHHmm)
    .reduce((max, rule) => Math.max(max, rule.capacitySlots), 0);

  if (matchingCapacity === 0) {
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

  if (overlappingCount >= matchingCapacity) {
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

  const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdBooking = await tx.booking.create({
      data: {
        tenantId,
        customerId: userId,
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
    await tx.auditLog.create({
      data: {
        tenantId,
        userId,
        action: "CREATE_BOOKING",
        resourceType: "Booking",
        resourceId: createdBooking.id,
        details: JSON.stringify({
          wrapId: createdBooking.wrapId,
          startTime: createdBooking.startTime.toISOString(),
          endTime: createdBooking.endTime.toISOString(),
        }),
        timestamp: new Date(),
      },
    });

    return createdBooking;
  });

  const invoice = await ensureInvoiceForBooking({ bookingId: booking.id });

  return {
    id: booking.id,
    wrapId: booking.wrapId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    totalPrice: booking.totalPrice,
    invoiceId: invoice.invoiceId,
  };
}
