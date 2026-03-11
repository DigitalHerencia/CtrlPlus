"use server";

import { getSession } from "@/lib/auth/session";
import { requireCustomerOwnedResourceAccess } from "@/lib/authz/policy";
import { prisma } from "@/lib/prisma";

export interface ConfirmedBookingDTO {
  id: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: "confirmed";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function confirmBooking(bookingId: string): Promise<ConfirmedBookingDTO> {
  const session = await getSession();
  const userId = session.userId;

  if (!session.isAuthenticated || !userId) {
    throw new Error("Unauthorized: not authenticated");
  }

  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const booking = await tx.booking.findFirst({
      where: {
        id: bookingId,
        deletedAt: null,
      },
      select: {
        id: true,
        customerId: true,
        wrapId: true,
        startTime: true,
        endTime: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        updatedAt: true,
        reservation: {
          select: {
            id: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Forbidden: resource not found");
    }

    requireCustomerOwnedResourceAccess(session.authz, booking.customerId);

    if (booking.status !== "pending") {
      throw new Error("Only pending bookings can be confirmed");
    }

    if (!booking.reservation || booking.reservation.expiresAt <= now) {
      throw new Error("Reservation has expired; please reserve again");
    }

    const confirmed = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "confirmed",
        reservation: {
          delete: true,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: "CONFIRM_BOOKING",
        resourceType: "Booking",
        resourceId: confirmed.id,
        details: JSON.stringify({
          previousStatus: booking.status,
          confirmedAt: now.toISOString(),
        }),
        timestamp: now,
      },
    });

    return {
      id: confirmed.id,
      customerId: confirmed.customerId,
      wrapId: confirmed.wrapId,
      startTime: confirmed.startTime,
      endTime: confirmed.endTime,
      status: "confirmed",
      totalPrice: confirmed.totalPrice,
      createdAt: confirmed.createdAt,
      updatedAt: confirmed.updatedAt,
    };
  });
}
