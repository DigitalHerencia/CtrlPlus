import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.hoisted(() => vi.fn());
const mockAssertTenantMembership = vi.hoisted(() => vi.fn());
const mockHasBookingConflict = vi.hoisted(() => vi.fn());
const mockPrismaBookingFindFirst = vi.hoisted(() => vi.fn());
const mockPrismaBookingUpdate = vi.hoisted(() => vi.fn());
const mockPrismaAuditLogCreate = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth/session", () => ({
  getSession: mockGetSession,
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mockAssertTenantMembership,
}));

vi.mock("@/lib/scheduling/fetchers/get-bookings", () => ({
  hasBookingConflict: mockHasBookingConflict,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findFirst: mockPrismaBookingFindFirst,
      update: mockPrismaBookingUpdate,
    },
    auditLog: { create: mockPrismaAuditLogCreate },
  },
}));

import { updateBooking } from "../update-booking";

const TENANT_ID = "tenant-001";
const USER_ID = "user-001";
const BOOKING_ID = "booking-001";

const futureDates = {
  dropOffStart: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  dropOffEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  pickUpStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  pickUpEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
};

const existingBooking = {
  id: BOOKING_ID,
  tenantId: TENANT_ID,
  customerId: "customer-001",
  wrapId: "wrap-001",
  ...futureDates,
  status: "PENDING",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("updateBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: USER_ID },
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockHasBookingConflict.mockResolvedValue(false);
    mockPrismaBookingFindFirst.mockResolvedValue(existingBooking);
    mockPrismaBookingUpdate.mockResolvedValue({
      ...existingBooking,
      status: "CONFIRMED",
    });
    mockPrismaAuditLogCreate.mockResolvedValue({});
  });

  it("updates booking status and returns a BookingDTO", async () => {
    const result = await updateBooking({
      bookingId: BOOKING_ID,
      status: "CONFIRMED",
    });

    expect(result.status).toBe("CONFIRMED");
    expect(result.id).toBe(BOOKING_ID);
  });

  it("enforces authentication — throws if no user", async () => {
    mockGetSession.mockResolvedValue({ user: null, tenantId: "" });

    await expect(
      updateBooking({ bookingId: BOOKING_ID, status: "CONFIRMED" })
    ).rejects.toThrow("Unauthorized");
  });

  it("requires ADMIN role for status changes", async () => {
    await updateBooking({ bookingId: BOOKING_ID, status: "CONFIRMED" });

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      TENANT_ID,
      USER_ID,
      "ADMIN"
    );
  });

  it("requires only MEMBER role for reschedule (no status change)", async () => {
    const newDropOff = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    mockPrismaBookingUpdate.mockResolvedValue({
      ...existingBooking,
      dropOffStart: newDropOff,
    });

    await updateBooking({ bookingId: BOOKING_ID, dropOffStart: newDropOff });

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      TENANT_ID,
      USER_ID,
      "MEMBER"
    );
  });

  it("throws when booking not found in tenant scope", async () => {
    mockPrismaBookingFindFirst.mockResolvedValue(null);

    await expect(
      updateBooking({ bookingId: BOOKING_ID, status: "CONFIRMED" })
    ).rejects.toThrow("Forbidden: booking not found");
  });

  it("throws when trying to update a CANCELLED booking", async () => {
    mockPrismaBookingFindFirst.mockResolvedValue({
      ...existingBooking,
      status: "CANCELLED",
    });

    await expect(
      updateBooking({ bookingId: BOOKING_ID, status: "PENDING" })
    ).rejects.toThrow('Cannot update a booking with status "CANCELLED"');
  });

  it("throws when trying to update a COMPLETED booking", async () => {
    mockPrismaBookingFindFirst.mockResolvedValue({
      ...existingBooking,
      status: "COMPLETED",
    });

    await expect(
      updateBooking({ bookingId: BOOKING_ID, notes: "updated" })
    ).rejects.toThrow('Cannot update a booking with status "COMPLETED"');
  });

  it("checks for slot conflict when rescheduling", async () => {
    const newDropOff = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    mockPrismaBookingUpdate.mockResolvedValue({
      ...existingBooking,
      dropOffStart: newDropOff,
    });

    await updateBooking({ bookingId: BOOKING_ID, dropOffStart: newDropOff });

    expect(mockHasBookingConflict).toHaveBeenCalledWith(
      TENANT_ID,
      newDropOff,
      existingBooking.pickUpEnd,
      BOOKING_ID
    );
  });

  it("throws when rescheduling causes a slot conflict", async () => {
    mockHasBookingConflict.mockResolvedValue(true);

    const newDropOff = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    await expect(
      updateBooking({ bookingId: BOOKING_ID, dropOffStart: newDropOff })
    ).rejects.toThrow("Slot unavailable");
  });

  it("writes an audit log with BOOKING_UPDATED action", async () => {
    await updateBooking({ bookingId: BOOKING_ID, status: "CONFIRMED" });

    expect(mockPrismaAuditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: TENANT_ID,
          userId: USER_ID,
          action: "BOOKING_UPDATED",
          resourceId: BOOKING_ID,
        }),
      })
    );
  });

  it("does not run conflict check for status-only updates", async () => {
    await updateBooking({ bookingId: BOOKING_ID, status: "CONFIRMED" });

    expect(mockHasBookingConflict).not.toHaveBeenCalled();
  });
});
