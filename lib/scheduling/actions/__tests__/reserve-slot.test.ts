import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    availabilityRule: {
      findMany: vi.fn(),
    },
    booking: {
      count: vi.fn(),
      create: vi.fn(),
    },
    wrap: {
      findFirst: vi.fn(),
    },
    bookingReservation: {
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { Prisma } from "@prisma/client";
import { reserveSlot } from "../reserve-slot";

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const START = new Date("2025-01-06T09:00:00.000Z");
const END = new Date("2025-01-06T11:00:00.000Z");

const bookingRecord = {
  id: "booking-1",
  wrapId: "wrap-1",
  startTime: START,
  endTime: END,
  status: "pending",
  totalPrice: 150000,
  reservation: {
    expiresAt: new Date("2025-01-06T09:15:00.000Z"),
  },
};

describe("reserveSlot", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(prisma.$transaction).mockImplementation(
      (fn: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        fn(prisma as unknown as Prisma.TransactionClient),
    );

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue({ id: "wrap-1", price: 150000 } as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([
      { startTime: "08:00", endTime: "18:00", capacitySlots: 2 },
    ] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.bookingReservation.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.booking.create).mockResolvedValue(bookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
  });

  it("creates a pending booking with reservation hold", async () => {
    const result = await reserveSlot({ wrapId: "wrap-1", startTime: START, endTime: END });

    expect(result.status).toBe("pending");
    expect(result.reservationExpiresAt).toBeInstanceOf(Date);
    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "pending",
          reservation: {
            create: {
              expiresAt: expect.any(Date),
            },
          },
        }),
      }),
    );
  });

  it("uses SERIALIZABLE transaction isolation for capacity safety", async () => {
    await reserveSlot({ wrapId: "wrap-1", startTime: START, endTime: END });

    expect(prisma.$transaction).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }),
    );
  });

  it("enforces one active reservation per user per tenant", async () => {
    vi.mocked(prisma.bookingReservation.findFirst).mockResolvedValue({ id: "res-1" } as never);

    await expect(reserveSlot({ wrapId: "wrap-1", startTime: START, endTime: END })).rejects.toThrow(
      "already have an active reservation",
    );
  });

  it("counts only active booking states for capacity", async () => {
    await reserveSlot({ wrapId: "wrap-1", startTime: START, endTime: END });

    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { status: "confirmed" },
            { status: "completed" },
            {
              status: "pending",
              reservation: {
                is: {
                  expiresAt: { gt: expect.any(Date) },
                },
              },
            },
          ],
        }),
      }),
    );
  });
});
