import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.hoisted(() => vi.fn());
const mockAssertTenantMembership = vi.hoisted(() => vi.fn());
const mockPrismaBookingFindFirst = vi.hoisted(() => vi.fn());
const mockPrismaBookingUpdate = vi.hoisted(() => vi.fn());
const mockPrismaAuditLogCreate = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth/session", () => ({
  getSession: mockGetSession,
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mockAssertTenantMembership,
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

import { cancelBooking } from "../cancel-booking";

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

const cancelledBooking = { ...existingBooking, status: "CANCELLED" };

describe("cancelBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: USER_ID },
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrismaBookingFindFirst.mockResolvedValue(existingBooking);
    mockPrismaBookingUpdate.mockResolvedValue(cancelledBooking);
    mockPrismaAuditLogCreate.mockResolvedValue({});
  });

  it("cancels a booking and returns a BookingDTO with CANCELLED status", async () => {
    const result = await cancelBooking({ bookingId: BOOKING_ID });

    expect(result.status).toBe("CANCELLED");
    expect(result.id).toBe(BOOKING_ID);
  });

  it("enforces authentication — throws if no user", async () => {
    mockGetSession.mockResolvedValue({ user: null, tenantId: "" });

    await expect(cancelBooking({ bookingId: BOOKING_ID })).rejects.toThrow(
      "Unauthorized"
    );
  });

  it("enforces authorization via assertTenantMembership", async () => {
    await cancelBooking({ bookingId: BOOKING_ID });

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      TENANT_ID,
      USER_ID,
      "MEMBER"
    );
  });

  it("throws when booking not found in tenant scope", async () => {
    mockPrismaBookingFindFirst.mockResolvedValue(null);

    await expect(cancelBooking({ bookingId: BOOKING_ID })).rejects.toThrow(
      "Forbidden: booking not found"
    );
  });

  it("throws when booking is already CANCELLED", async () => {
    mockPrismaBookingFindFirst.mockResolvedValue({
      ...existingBooking,
      status: "CANCELLED",
    });

    await expect(cancelBooking({ bookingId: BOOKING_ID })).rejects.toThrow(
      'Cannot cancel a booking with status "CANCELLED"'
    );
  });

  it("throws when booking is COMPLETED", async () => {
    mockPrismaBookingFindFirst.mockResolvedValue({
      ...existingBooking,
      status: "COMPLETED",
    });

    await expect(cancelBooking({ bookingId: BOOKING_ID })).rejects.toThrow(
      'Cannot cancel a booking with status "COMPLETED"'
    );
  });

  it("updates status to CANCELLED scoped by booking id", async () => {
    await cancelBooking({ bookingId: BOOKING_ID });

    expect(mockPrismaBookingUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: BOOKING_ID },
        data: { status: "CANCELLED" },
      })
    );
  });

  it("writes an audit log with BOOKING_CANCELLED action", async () => {
    await cancelBooking({ bookingId: BOOKING_ID, reason: "Customer request" });

    expect(mockPrismaAuditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: TENANT_ID,
          userId: USER_ID,
          action: "BOOKING_CANCELLED",
          resourceId: BOOKING_ID,
          details: expect.objectContaining({ reason: "Customer request" }),
        }),
      })
    );
  });

  it("looks up booking with tenantId scope", async () => {
    await cancelBooking({ bookingId: BOOKING_ID });

    expect(mockPrismaBookingFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: BOOKING_ID, tenantId: TENANT_ID }),
      })
    );
  });
});
