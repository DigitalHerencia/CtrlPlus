"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { cancelBookingSchema, type CancelBookingInput } from "../types";

/**
 * Cancels an existing booking that belongs to the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  – get user & tenant from session
 * 2. Authorize     – assert tenant membership (owner/admin can cancel any;
 *                    member can only cancel their own)
 * 3. Validate      – parse & validate input with Zod
 * 4. Mutate        – soft-delete / status update scoped by tenantId
 * 5. Audit         – log the cancellation
 */
export async function cancelBooking(input: CancelBookingInput): Promise<void> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  await assertTenantMembership(tenantId, user.id, ["OWNER", "ADMIN", "MEMBER"]);

  // Step 3: VALIDATE
  const parsed = cancelBookingSchema.parse(input);

  // Step 4: MUTATE
  // TODO: Replace with real Prisma mutation once the DB is wired up.
  // const booking = await prisma.booking.findFirst({
  //   where: { id: parsed.bookingId, tenantId, deletedAt: null },
  // });
  // if (!booking) throw new Error("Booking not found");
  // if (booking.customerId !== user.id) {
  //   await assertTenantMembership(tenantId, user.id, ["OWNER", "ADMIN"]);
  // }
  // await prisma.booking.update({
  //   where: { id: parsed.bookingId },
  //   data: { status: "CANCELLED", cancelReason: parsed.reason, updatedAt: new Date() },
  // });

  // Step 5: AUDIT
  // await prisma.auditLog.create({
  //   data: { tenantId, userId: user.id, action: "CANCEL_BOOKING", resourceId: parsed.bookingId },
  // });

  void parsed;
}
