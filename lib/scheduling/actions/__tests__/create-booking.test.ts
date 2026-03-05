import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoist mock variables so they can be used in vi.mock() factories
const mockGetSession = vi.hoisted(() => vi.fn());
const mockAssertTenantMembership = vi.hoisted(() => vi.fn());
const mockHasBookingConflict = vi.hoisted(() => vi.fn());
const mockPrismaBookingCreate = vi.hoisted(() => vi.fn());
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
    booking: { create: mockPrismaBookingCreate },
    auditLog: { create: mockPrismaAuditLogCreate },
  },
}));

import { createBooking } from "../create-booking";

const TENANT_ID = "tenant-001";
const USER_ID = "user-001";
const CUSTOMER_ID = "customer-001";
const WRAP_ID = "wrap-001";

const futureDates = {
  dropOffStart: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // +1 day
  dropOffEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  pickUpStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  pickUpEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
};

const validInput = {
  customerId: CUSTOMER_ID,
  wrapId: WRAP_ID,
  ...futureDates,
};

const mockBookingRecord = {
  id: "booking-001",
  tenantId: TENANT_ID,
  customerId: CUSTOMER_ID,
  wrapId: WRAP_ID,
  ...futureDates,
  status: "PENDING",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: USER_ID },
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockHasBookingConflict.mockResolvedValue(false);
    mockPrismaBookingCreate.mockResolvedValue(mockBookingRecord);
    mockPrismaAuditLogCreate.mockResolvedValue({});
  });

  it("creates a booking and returns a BookingDTO", async () => {
    const result = await createBooking(validInput);

    expect(result.id).toBe("booking-001");
    expect(result.tenantId).toBe(TENANT_ID);
    expect(result.status).toBe("PENDING");
  });

  it("enforces authentication — throws if no user", async () => {
    mockGetSession.mockResolvedValue({ user: null, tenantId: "" });

    await expect(createBooking(validInput)).rejects.toThrow("Unauthorized");
  });

  it("enforces authorization via assertTenantMembership", async () => {
    await createBooking(validInput);

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      TENANT_ID,
      USER_ID,
      "MEMBER"
    );
  });

  it("throws when assertTenantMembership rejects", async () => {
    mockAssertTenantMembership.mockRejectedValue(
      new Error("Forbidden: not a member of this tenant")
    );

    await expect(createBooking(validInput)).rejects.toThrow("Forbidden");
  });

  it("rejects when a slot conflict is detected", async () => {
    mockHasBookingConflict.mockResolvedValue(true);

    await expect(createBooking(validInput)).rejects.toThrow("Slot unavailable");
  });

  it("scopes the booking by tenantId", async () => {
    await createBooking(validInput);

    expect(mockPrismaBookingCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: TENANT_ID }),
      })
    );
  });

  it("writes an audit log after creation", async () => {
    await createBooking(validInput);

    expect(mockPrismaAuditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: TENANT_ID,
          userId: USER_ID,
          action: "BOOKING_CREATED",
          resourceId: "booking-001",
        }),
      })
    );
  });

  it("rejects invalid input — dropOffEnd before dropOffStart", async () => {
    const invalidInput = {
      ...validInput,
      dropOffEnd: new Date(validInput.dropOffStart.getTime() - 1),
    };

    await expect(createBooking(invalidInput)).rejects.toThrow();
  });

  it("rejects invalid input — dropOffStart in the past", async () => {
    const pastInput = {
      ...validInput,
      dropOffStart: new Date(Date.now() - 1000),
    };

    await expect(createBooking(pastInput)).rejects.toThrow();
  });
});
