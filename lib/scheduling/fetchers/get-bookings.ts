import { type BookingDTO, type BookingStatus } from "../types";

/**
 * Returns all bookings for the given tenant, optionally filtered by status.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param status   - Optional status filter
 */
export async function getBookingsForTenant(
  tenantId: string,
  status?: BookingStatus
): Promise<BookingDTO[]> {
  // TODO: Replace with real Prisma query once the DB is wired up.
  // const bookings = await prisma.booking.findMany({
  //   where: {
  //     tenantId,
  //     deletedAt: null,
  //     ...(status && { status }),
  //   },
  //   orderBy: { createdAt: "desc" },
  //   select: { ... },
  // });

  void tenantId;
  void status;
  return [];
}

/**
 * Returns a single booking by ID, scoped to the tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param bookingId - Booking ID
 */
export async function getBookingById(
  tenantId: string,
  bookingId: string
): Promise<BookingDTO | null> {
  // TODO: Replace with real Prisma query once the DB is wired up.
  // const booking = await prisma.booking.findFirst({
  //   where: { id: bookingId, tenantId, deletedAt: null },
  //   select: { ... },
  // });

  void tenantId;
  void bookingId;
  return null;
}
