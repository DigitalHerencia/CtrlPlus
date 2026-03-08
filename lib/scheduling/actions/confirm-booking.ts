"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";

export interface ConfirmedBookingDTO {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: "confirmed";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Confirms a pending booking if its reservation is still active.
 */
export async function confirmBooking(bookingId: string): Promise<ConfirmedBookingDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId);

  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const booking = await tx.booking.findFirst({
      where: {
        id: bookingId,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        tenantId: true,
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

    if (booking.customerId !== userId) {
      await assertTenantMembership(tenantId, userId);
    }

    if (booking.status !== "pending") {
      throw new Error("Only pending bookings can be confirmed");
    }

    if (!booking.reservation || booking.reservation.expiresAt <= now) {
      throw new Error("Reservation has expired; please reserve again");
    }

    const confirmed = await tx.booking.update({
      where: { id: booking.id, tenantId },
      data: {
        status: "confirmed",
        reservation: {
          delete: true,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        tenantId,
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
      tenantId: confirmed.tenantId,
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
