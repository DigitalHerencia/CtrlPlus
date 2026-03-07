import { prisma } from "@/lib/prisma";

export interface CleanupExpiredReservationsInput {
  tenantId?: string;
  now?: Date;
  limit?: number;
}

export interface CleanupExpiredReservationsResult {
  processedReservationIds: string[];
  processedBookingIds: string[];
}

/**
 * Job-safe cleanup for expired booking reservations.
 *
 * Intended for cron/manual invocation from an internal job runner.
 */
export async function cleanupExpiredReservations(
  input: CleanupExpiredReservationsInput = {},
): Promise<CleanupExpiredReservationsResult> {
  const now = input.now ?? new Date();
  const limit = input.limit ?? 100;

  const expired = await prisma.bookingReservation.findMany({
    where: {
      expiresAt: { lte: now },
      booking: {
        deletedAt: null,
        status: "pending",
        ...(input.tenantId ? { tenantId: input.tenantId } : {}),
      },
    },
    select: {
      id: true,
      bookingId: true,
      booking: {
        select: {
          tenantId: true,
        },
      },
    },
    take: limit,
    orderBy: { expiresAt: "asc" },
  });

  if (expired.length === 0) {
    return { processedReservationIds: [], processedBookingIds: [] };
  }

  const bookingIds = expired.map((item) => item.bookingId);
  const reservationIds = expired.map((item) => item.id);

  await prisma.$transaction(async (tx) => {
    await tx.booking.updateMany({
      where: {
        id: { in: bookingIds },
        status: "pending",
        deletedAt: null,
      },
      data: {
        status: "cancelled",
        deletedAt: now,
      },
    });

    await tx.bookingReservation.deleteMany({
      where: {
        id: { in: reservationIds },
      },
    });

    await tx.auditLog.createMany({
      data: expired.map((record) => ({
        tenantId: record.booking.tenantId,
        userId: "system",
        action: "EXPIRE_BOOKING_RESERVATION",
        resourceType: "Booking",
        resourceId: record.bookingId,
        details: JSON.stringify({ reservationId: record.id, expiredAt: now.toISOString() }),
        timestamp: now,
      })),
    });
  });

  return {
    processedReservationIds: reservationIds,
    processedBookingIds: bookingIds,
  };
}
