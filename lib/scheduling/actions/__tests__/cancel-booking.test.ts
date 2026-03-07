import { beforeEach, describe, expect, it, vi } from "vitest";
import { cancelBooking } from "../cancel-booking";

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    booking: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    bookingReservation: {
      deleteMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import type { Prisma } from "@prisma/client";

const NOW = new Date("2025-06-15T10:00:00.000Z");
const TWO_HOURS_LATER = new Date("2025-06-15T12:00:00.000Z");

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const existingBooking = {
  id: "booking-1",
  tenantId: "tenant-1",
  status: "confirmed",
};

const cancelledBookingRecord = {
  id: "booking-1",
  tenantId: "tenant-1",
  customerId: "user-1",
  wrapId: "wrap-1",
  startTime: NOW,
  endTime: TWO_HOURS_LATER,
  status: "cancelled",
  totalPrice: 1500,
  createdAt: NOW,
  updatedAt: NOW,
};

describe("cancelBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.$transaction).mockImplementation(
      (fn: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        fn(prisma as unknown as Prisma.TransactionClient),
    );
  });

  it("cancels a booking and returns a DTO when the user is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.bookingReservation.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.booking.update).mockResolvedValue(cancelledBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await cancelBooking("booking-1");

    expect(result).toMatchObject({
      id: "booking-1",
      tenantId: "tenant-1",
      status: "cancelled",
    });
  });

  it("deletes active reservation and sets status to cancelled", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.bookingReservation.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.booking.update).mockResolvedValue(cancelledBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await cancelBooking("booking-1");

    expect(prisma.bookingReservation.deleteMany).toHaveBeenCalledWith({
      where: { bookingId: "booking-1" },
    });
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "cancelled" }),
      }),
    );
  });
});
