import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    bookingReservation: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    booking: {
      updateMany: vi.fn(),
    },
    auditLog: {
      createMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cleanupExpiredReservations } from "../cleanup-expired-reservations";

describe("cleanupExpiredReservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(prisma.$transaction).mockImplementation(
      (fn: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        fn(prisma as unknown as Prisma.TransactionClient),
    );

    vi.mocked(prisma.booking.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.bookingReservation.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.auditLog.createMany).mockResolvedValue({ count: 1 } as never);
  });

  it("returns empty result when no expired reservations exist", async () => {
    vi.mocked(prisma.bookingReservation.findMany).mockResolvedValue([] as never);

    const result = await cleanupExpiredReservations();

    expect(result).toEqual({ processedReservationIds: [], processedBookingIds: [] });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("cancels pending bookings and removes expired reservations", async () => {
    vi.mocked(prisma.bookingReservation.findMany).mockResolvedValue([
      {
        id: "res-1",
        bookingId: "booking-1",
        booking: {
          tenantId: "tenant-1",
        },
      },
    ] as never);

    const now = new Date("2026-02-01T08:00:00.000Z");
    const result = await cleanupExpiredReservations({ now });

    expect(prisma.booking.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "cancelled",
          deletedAt: now,
        }),
      }),
    );
    expect(prisma.bookingReservation.deleteMany).toHaveBeenCalled();
    expect(result).toEqual({
      processedReservationIds: ["res-1"],
      processedBookingIds: ["booking-1"],
    });
  });
});
