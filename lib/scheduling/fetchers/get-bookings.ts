import { prisma } from "@/lib/prisma";
import {
  type BookingDTO,
  type BookingStatus,
  bookingDTOFields,
} from "../types";

/**
 * Fetches all non-cancelled bookings for a tenant.
 * @param tenantId - Tenant scope (server-side verified)
 * @returns Array of BookingDTOs ordered by dropOffStart ascending
 */
export async function getBookingsForTenant(
  tenantId: string
): Promise<BookingDTO[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      tenantId,
      status: { not: "CANCELLED" },
    },
    orderBy: { dropOffStart: "asc" },
    select: bookingDTOFields,
  });

  return bookings.map((b) => ({
    ...b,
    status: b.status as BookingStatus,
  }));
}

/**
 * Fetches a single booking by ID, scoped to tenant.
 * @param tenantId - Tenant scope (server-side verified)
 * @param bookingId - Booking ID
 * @returns BookingDTO or null if not found / belongs to another tenant
 */
export async function getBookingById(
  tenantId: string,
  bookingId: string
): Promise<BookingDTO | null> {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, tenantId },
    select: bookingDTOFields,
  });

  if (!booking) return null;

  return {
    ...booking,
    status: booking.status as BookingStatus,
  };
}

/**
 * Fetches all bookings for a specific customer within a tenant.
 * @param tenantId - Tenant scope
 * @param customerId - Customer ID
 * @returns Array of BookingDTOs ordered by dropOffStart descending
 */
export async function getBookingsForCustomer(
  tenantId: string,
  customerId: string
): Promise<BookingDTO[]> {
  const bookings = await prisma.booking.findMany({
    where: { tenantId, customerId },
    orderBy: { dropOffStart: "desc" },
    select: bookingDTOFields,
  });

  return bookings.map((b) => ({
    ...b,
    status: b.status as BookingStatus,
  }));
}

/**
 * Checks for any overlapping bookings in a time slot (for conflict detection).
 * @param tenantId - Tenant scope
 * @param dropOffStart - Start of the drop-off window
 * @param dropOffEnd - End of the pick-up window (full range)
 * @param excludeBookingId - Optional booking ID to exclude (for updates)
 * @returns true if a conflict exists
 */
export async function hasBookingConflict(
  tenantId: string,
  dropOffStart: Date,
  pickUpEnd: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const conflicting = await prisma.booking.findFirst({
    where: {
      tenantId,
      status: { notIn: ["CANCELLED", "COMPLETED"] },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
      // Overlap: existing.dropOffStart < new.pickUpEnd AND existing.pickUpEnd > new.dropOffStart
      dropOffStart: { lt: pickUpEnd },
      pickUpEnd: { gt: dropOffStart },
    },
    select: { id: true },
  });

  return conflicting !== null;
}
