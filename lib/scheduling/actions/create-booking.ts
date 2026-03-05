"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import {
  createBookingSchema,
  type BookingDTO,
  type CreateBookingInput,
} from "../types";

/**
 * Creates a new booking for the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  – get user & tenant from session
 * 2. Authorize     – assert tenant membership
 * 3. Validate      – parse & validate input with Zod
 * 4. Mutate        – create booking record scoped by tenantId
 * 5. Audit         – log the booking creation
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

  // Step 4: MUTATE
  // TODO: Replace with real Prisma mutation once the DB is wired up.
  // Validate that the selected slots are still available.
  // const [dropOff, pickUp] = await Promise.all([
  //   prisma.timeSlot.findFirst({ where: { id: parsed.dropOffSlotId, tenantId, remainingCapacity: { gt: 0 } } }),
  //   prisma.timeSlot.findFirst({ where: { id: parsed.pickUpSlotId, tenantId, remainingCapacity: { gt: 0 } } }),
  // ]);
  // if (!dropOff) throw new Error("Drop-off slot is no longer available");
  // if (!pickUp)  throw new Error("Pick-up slot is no longer available");
  //
  // const booking = await prisma.booking.create({
  //   data: {
  //     tenantId,
  //     customerId: user.id,
  //     customerName:   parsed.customerName,
  //     customerEmail:  parsed.customerEmail,
  //     wrapId:         parsed.wrapId,
  //     dropOffSlotId:  parsed.dropOffSlotId,
  //     pickUpSlotId:   parsed.pickUpSlotId,
  //     notes:          parsed.notes,
  //     status:         "PENDING",
  //   },
  // });

  // Step 5: AUDIT
  // await prisma.auditLog.create({ data: { tenantId, userId: user.id, action: "CREATE_BOOKING", resourceId: booking.id } });

  /** Extracts the ISO date string "YYYY-MM-DD" from a slot ID like "2026-03-09-1000". */
  function slotIdToDate(slotId: string): string {
    return slotId.split("-").slice(0, 3).join("-");
  }

  /** Extracts the formatted time "HH:MM" from a slot ID like "2026-03-09-1000". */
  function slotIdToTime(slotId: string): string {
    return slotId.split("-")[3]?.replace(/(\d{2})(\d{2})/, "$1:$2") ?? "";
  }

  // Stub return
  const now = new Date();
  const booking: BookingDTO = {
    id: `booking-${Date.now()}`,
    tenantId,
    customerId: user.id,
    customerName: parsed.customerName,
    customerEmail: parsed.customerEmail,
    wrapId: parsed.wrapId,
    wrapName: "",
    dropOffSlotId: parsed.dropOffSlotId,
    dropOffDate: slotIdToDate(parsed.dropOffSlotId),
    dropOffTime: slotIdToTime(parsed.dropOffSlotId),
    pickUpSlotId: parsed.pickUpSlotId,
    pickUpDate: slotIdToDate(parsed.pickUpSlotId),
    pickUpTime: slotIdToTime(parsed.pickUpSlotId),
    status: "PENDING",
    notes: parsed.notes,
    createdAt: now,
    updatedAt: now,
  };

  return booking;
}
