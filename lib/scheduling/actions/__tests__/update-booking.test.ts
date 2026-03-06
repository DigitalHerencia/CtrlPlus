import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateBooking } from "../update-booking";

// ── Mock dependencies ─────────────────────────────────────────────────────────

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
      findFirst: vi.fn(),
      count: vi.fn(),
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
import type { Prisma } from "@prisma/client";

// ── Helpers ───────────────────────────────────────────────────────────────────

const OLD_START = new Date("2025-06-15T10:00:00.000Z");
const OLD_END = new Date("2025-06-15T12:00:00.000Z");
const NEW_START = new Date("2025-06-16T14:00:00.000Z"); // Monday
const NEW_END = new Date("2025-06-16T16:00:00.000Z");

const mockSession = {
  user: { id: "user-1", clerkUserId: "user-1", email: "customer@example.com" },
  tenantId: "tenant-1",
};

const validInput = { startTime: NEW_START, endTime: NEW_END };

const existingBooking = {
  id: "booking-1",
  tenantId: "tenant-1",
  startTime: OLD_START,
  endTime: OLD_END,
  status: "confirmed",
};

const updatedBookingRecord = {
  id: "booking-1",
  tenantId: "tenant-1",
  customerId: "user-1",
  wrapId: "wrap-1",
  startTime: NEW_START,
  endTime: NEW_END,
  status: "confirmed",
  totalPrice: 1500,
  createdAt: OLD_START,
  updatedAt: NEW_START,
};

const mockRule = { capacitySlots: 3, startTime: "09:00", endTime: "18:00" };

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("updateBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Make $transaction execute the callback with the same mocked prisma client
    vi.mocked(prisma.$transaction).mockImplementation(
      (fn: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        fn(prisma as unknown as Prisma.TransactionClient),
    );
  });

  it("reschedules a booking and returns an updated DTO when the user is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.update).mockResolvedValue(updatedBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateBooking("booking-1", validInput);

    expect(result).toMatchObject({
      id: "booking-1",
      tenantId: "tenant-1",
      startTime: NEW_START,
      endTime: NEW_END,
    });
  });

  it("updates only startTime and endTime on the booking", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.update).mockResolvedValue(updatedBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateBooking("booking-1", validInput);

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "booking-1", tenantId: "tenant-1" }),
        data: { startTime: NEW_START, endTime: NEW_END },
      }),
    );
  });

  it("excludes the booking being rescheduled from the overlap count", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.update).mockResolvedValue(updatedBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateBooking("booking-1", validInput);

    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: "booking-1" },
        }),
      }),
    );
  });

  it("writes an audit log entry with old and new times after rescheduling", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.update).mockResolvedValue(updatedBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateBooking("booking-1", validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "UPDATE_BOOKING",
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

    await expect(updateBooking("booking-1", validInput)).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(updateBooking("booking-1", validInput)).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when the booking belongs to a different tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    // findFirst returns null — booking not found in this tenant
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(null);

    await expect(updateBooking("booking-1", validInput)).rejects.toThrow("Forbidden");
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it("throws when no availability rules are configured for the new day", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([] as never);

    await expect(updateBooking("booking-1", validInput)).rejects.toThrow(
      "No availability configured",
    );
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it("throws when all capacity slots are occupied for the new time slot", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([
      { capacitySlots: 2, startTime: "09:00", endTime: "18:00" },
    ] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(2);

    await expect(updateBooking("booking-1", validInput)).rejects.toThrow("No available slots");
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it("throws a ZodError when endTime is before startTime", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(existingBooking as never);

    const badInput = {
      startTime: NEW_END,
      endTime: NEW_START,
    };

    await expect(updateBooking("booking-1", badInput)).rejects.toThrow();
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });
});
