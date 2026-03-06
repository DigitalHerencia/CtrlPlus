import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBooking } from "../create-booking";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    availabilityRule: {
      findMany: vi.fn(),
    },
    booking: {
      count: vi.fn(),
      create: vi.fn(),
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

const NOW = new Date("2025-06-15T10:00:00.000Z"); // Sunday
const TWO_HOURS_LATER = new Date("2025-06-15T12:00:00.000Z");

const mockSession = {
  user: { id: "user-1", clerkUserId: "user-1", email: "customer@example.com" },
  tenantId: "tenant-1",
};

const validInput = {
  wrapId: "wrap-1",
  startTime: NOW,
  endTime: TWO_HOURS_LATER,
  totalPrice: 1500,
};

const mockRule = { capacitySlots: 3 };

const mockBookingRecord = {
  id: "booking-1",
  tenantId: "tenant-1",
  customerId: "user-1",
  wrapId: "wrap-1",
  startTime: NOW,
  endTime: TWO_HOURS_LATER,
  status: "pending",
  totalPrice: 1500,
  createdAt: NOW,
  updatedAt: NOW,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a booking and returns a DTO when the user is authorized and a slot is available", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await createBooking(validInput);

    expect(result).toMatchObject({
      id: "booking-1",
      tenantId: "tenant-1",
      customerId: "user-1",
      wrapId: "wrap-1",
      status: "pending",
      totalPrice: 1500,
    });
  });

  it("scopes the mutation to the current tenantId", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createBooking(validInput);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });

  it("sets customerId from the session user id (not from input)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createBooking(validInput);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ customerId: "user-1" }),
      }),
    );
  });

  it("sets initial status to 'pending'", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createBooking(validInput);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "pending" }),
      }),
    );
  });

  it("writes an audit log entry after creating the booking", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createBooking(validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CREATE_BOOKING",
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

    await expect(createBooking(validInput)).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(createBooking(validInput)).rejects.toThrow("Forbidden");
  });

  it("throws when no availability rules are configured for the day", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([] as never);

    await expect(createBooking(validInput)).rejects.toThrow("No availability configured");
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("throws when all capacity slots are occupied", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([{ capacitySlots: 2 }] as never);
    // 2 existing overlapping bookings == capacity of 2 → no slots left
    vi.mocked(prisma.booking.count).mockResolvedValue(2);

    await expect(createBooking(validInput)).rejects.toThrow("No available slots");
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("checks availability scoped by tenantId", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([mockRule] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBookingRecord as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createBooking(validInput);

    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });

  it("throws a ZodError when endTime is before startTime", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = {
      ...validInput,
      endTime: new Date(NOW.getTime() - 1000),
    };

    await expect(createBooking(badInput)).rejects.toThrow();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("throws a ZodError when totalPrice is not positive", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { ...validInput, totalPrice: -50 };

    await expect(createBooking(badInput)).rejects.toThrow();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });
});
