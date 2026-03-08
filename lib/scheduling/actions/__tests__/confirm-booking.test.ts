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
    booking: {
      findFirst: vi.fn(),
      update: vi.fn(),
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
import { confirmBooking } from "../confirm-booking";

const now = new Date("2026-01-01T10:00:00.000Z");
const future = new Date("2026-01-01T10:10:00.000Z");

const bookingRecord = {
  id: "booking-1",
  tenantId: "tenant-1",
  customerId: "user-1",
  wrapId: "wrap-1",
  startTime: new Date("2026-01-02T09:00:00.000Z"),
  endTime: new Date("2026-01-02T11:00:00.000Z"),
  status: "pending",
  totalPrice: 250000,
  createdAt: now,
  updatedAt: now,
  reservation: {
    id: "res-1",
    expiresAt: future,
  },
};

describe("confirmBooking", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    vi.clearAllMocks();

    vi.mocked(prisma.$transaction).mockImplementation(
      (fn: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        fn(prisma as unknown as Prisma.TransactionClient),
    );

    vi.mocked(getSession).mockResolvedValue({
      userId: "user-1",
      tenantId: "tenant-1",
      isAuthenticated: true,
      orgId: null,
    });
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(bookingRecord as never);
    vi.mocked(prisma.booking.update).mockResolvedValue({
      ...bookingRecord,
      status: "confirmed",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
  });

  it("confirms a pending booking with non-expired reservation", async () => {
    const result = await confirmBooking("booking-1");

    expect(result.status).toBe("confirmed");
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "confirmed" }),
      }),
    );
  });

  it("rejects confirmation when reservation has expired", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue({
      ...bookingRecord,
      reservation: { id: "res-1", expiresAt: new Date("2026-01-01T09:59:00.000Z") },
    } as never);

    await expect(confirmBooking("booking-1")).rejects.toThrow("Reservation has expired");
  });

  it("requires admin access to confirm another member's booking", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue({
      ...bookingRecord,
      customerId: "user-2",
    } as never);

    await confirmBooking("booking-1");

    expect(assertTenantMembership).toHaveBeenNthCalledWith(1, "tenant-1", "user-1");
    expect(assertTenantMembership).toHaveBeenNthCalledWith(2, "tenant-1", "user-1", "admin");
  });
});
