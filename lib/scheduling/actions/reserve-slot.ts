"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertSlotHasCapacity } from "@/lib/scheduling/capacity";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const RESERVATION_TTL_MINUTES = 15;

const reserveSlotSchema = z
  .object({
    wrapId: z.string().min(1, "Wrap is required"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type ReserveSlotInput = z.infer<typeof reserveSlotSchema>;

export interface ReservedBookingDTO {
  id: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  totalPrice: number;
  reservationExpiresAt: Date;
}

/**
 * Reserves an available slot for 15 minutes by creating a pending booking and
 * an associated BookingReservation record.
 */
export async function reserveSlot(input: ReserveSlotInput): Promise<ReservedBookingDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId);

  const parsed = reserveSlotSchema.parse(input);

  return prisma.$transaction(
    async (tx) => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60 * 1000);

      const wrap = await tx.wrap.findFirst({
        where: { id: parsed.wrapId, tenantId, deletedAt: null },
        select: { id: true, price: true },
      });

      if (!wrap) {
        throw new Error("Wrap not found or does not belong to this tenant");
      }

      await assertSlotHasCapacity(tx, {
        tenantId,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        now,
      });

      const existingReservation = await tx.bookingReservation.findFirst({
        where: {
          expiresAt: { gt: now },
          booking: {
            tenantId,
            customerId: userId,
            status: "pending",
            deletedAt: null,
          },
        },
        select: { id: true },
      });

      if (existingReservation) {
        throw new Error("You already have an active reservation in this tenant");
      }

      const booking = await tx.booking.create({
        data: {
          tenantId,
          customerId: userId,
          wrapId: parsed.wrapId,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          status: "pending",
          totalPrice: wrap.price,
          reservation: {
            create: {
              expiresAt,
            },
          },
        },
        select: {
          id: true,
          wrapId: true,
          startTime: true,
          endTime: true,
          status: true,
          totalPrice: true,
          reservation: {
            select: {
              expiresAt: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: "RESERVE_SLOT",
          resourceType: "Booking",
          resourceId: booking.id,
          details: JSON.stringify({
            wrapId: booking.wrapId,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
            reservationExpiresAt: booking.reservation?.expiresAt.toISOString(),
          }),
          timestamp: now,
        },
      });

      return {
        id: booking.id,
        wrapId: booking.wrapId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalPrice: booking.totalPrice,
        reservationExpiresAt: booking.reservation?.expiresAt ?? expiresAt,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

export { RESERVATION_TTL_MINUTES };
