import { describe, it, expect, vi, beforeEach } from "vitest";
import { cancelBooking } from "../cancel-booking";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-06-15T10:00:00.000Z");
const TWO_HOURS_LATER = new Date("2025-06-15T12:00:00.000Z");

const mockSession = {
  user: { id: "user-1", clerkUserId: "user-1", email: "customer@example.com" },
  tenantId: "tenant-1",
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
  deletedAt: NOW,
  createdAt: NOW,
  updatedAt: NOW,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("cancelBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cancels a booking and returns a DTO when the user is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.booking.update).mockResolvedValue(cancelledBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await cancelBooking("booking-1");

    expect(result).toMatchObject({
      id: "booking-1",
      tenantId: "tenant-1",
      status: "cancelled",
    });
  });

  it("soft-deletes the booking (sets deletedAt) and sets status to 'cancelled'", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.booking.update).mockResolvedValue(cancelledBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await cancelBooking("booking-1");

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "booking-1", tenantId: "tenant-1" },
        data: expect.objectContaining({
          status: "cancelled",
          deletedAt: expect.any(Date),
        }),
      }),
    );
  });

  it("checks that the booking belongs to the current tenant before cancelling", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.booking.update).mockResolvedValue(cancelledBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await cancelBooking("booking-1");

    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "booking-1",
          tenantId: "tenant-1",
          deletedAt: null,
        }),
      }),
    );
  });

  it("writes an audit log entry after cancelling the booking", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.booking.update).mockResolvedValue(cancelledBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await cancelBooking("booking-1");

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CANCEL_BOOKING",
          resourceType: "Booking",
          resourceId: "booking-1",
          tenantId: "tenant-1",
          userId: "user-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: null, tenantId: "" });

    await expect(cancelBooking("booking-1")).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(cancelBooking("booking-1")).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when the booking belongs to a different tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    // findFirst returns null — booking not found in this tenant
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(null);

    await expect(cancelBooking("booking-1")).rejects.toThrow("Forbidden");
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });
});
