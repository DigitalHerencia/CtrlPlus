import { beforeEach, describe, expect, it, vi } from "vitest";
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
      findFirst: vi.fn(),
    },
    booking: {
      count: vi.fn(),
      create: vi.fn(),
    },
    wrap: {
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

// Monday 2025-01-06 09:00 – 17:00 UTC
const START = new Date("2025-01-06T09:00:00.000Z");
const END = new Date("2025-01-06T17:00:00.000Z");

const validInput = {
  wrapId: "wrap-1",
  startTime: START,
  endTime: END,
};

const mockRule = { id: "rule-1", capacitySlots: 2 };

const mockWrap = { id: "wrap-1", price: 150000 };

const mockBooking = {
  id: "booking-1",
  wrapId: "wrap-1",
  startTime: START,
  endTime: END,
  status: "pending",
  totalPrice: 150000,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default happy-path setup
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(mockRule as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it("creates a booking and returns the DTO", async () => {
    const result = await createBooking(validInput);

    expect(result).toMatchObject({
      id: "booking-1",
      wrapId: "wrap-1",
      status: "pending",
      totalPrice: 150000,
    });
    expect(result.startTime).toEqual(START);
    expect(result.endTime).toEqual(END);
  });

  it("scopes the booking mutation to the current tenantId", async () => {
    await createBooking(validInput);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });

  it("sets customerId to the authenticated user id", async () => {
    await createBooking(validInput);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ customerId: "user-1" }),
      }),
    );
  });

  it("writes an audit log after creating the booking", async () => {
    await createBooking(validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CREATE_BOOKING",
          tenantId: "tenant-1",
          userId: "user-1",
          resourceType: "Booking",
          resourceId: "booking-1",
        }),
      }),
    );
  });

  // ── Authentication ────────────────────────────────────────────────────────

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });

    await expect(createBooking(validInput)).rejects.toThrow("Unauthorized");
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  // ── Authorization ─────────────────────────────────────────────────────────

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(assertTenantMembership).mockRejectedValue(new Error("Forbidden: insufficient role"));

    await expect(createBooking(validInput)).rejects.toThrow("Forbidden");
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  // ── Validation ────────────────────────────────────────────────────────────

  it("throws a ZodError for missing wrapId", async () => {
    const bad = { ...validInput, wrapId: "" };

    await expect(createBooking(bad)).rejects.toThrow();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("throws a ZodError when endTime is not after startTime", async () => {
    const bad = { ...validInput, endTime: START }; // equal, not after

    await expect(createBooking(bad)).rejects.toThrow();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  // ── Availability checks ───────────────────────────────────────────────────

  it("throws when no matching availability rule is found", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(null);

    await expect(createBooking(validInput)).rejects.toThrow(
      "not within a configured availability window",
    );
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("throws when the slot is fully booked (overlapping count equals capacitySlots)", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue({
      id: "rule-1",
      capacitySlots: 1,
    } as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(1); // 1 existing == capacitySlots

    await expect(createBooking(validInput)).rejects.toThrow("fully booked");
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("allows booking when overlapping count is below capacitySlots", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue({
      id: "rule-1",
      capacitySlots: 3,
    } as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(2); // 2 existing < 3 capacity

    await expect(createBooking(validInput)).resolves.toBeDefined();
    expect(prisma.booking.create).toHaveBeenCalled();
  });

  it("queries overlapping bookings with correct tenant scope and non-cancelled filter", async () => {
    await createBooking(validInput);

    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-1",
          deletedAt: null,
          status: { notIn: ["cancelled"] },
          startTime: { lt: END },
          endTime: { gt: START },
        }),
      }),
    );
  });

  // ── Wrap scope check ──────────────────────────────────────────────────────

  it("throws when the wrap is not found in the current tenant", async () => {
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(null);

    await expect(createBooking(validInput)).rejects.toThrow(
      "Wrap not found or does not belong to this tenant",
    );
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it("does not accept tenantId from the input payload", async () => {
    const inputWithTenantId = {
      ...validInput,
      tenantId: "attacker-tenant",
    } as unknown as typeof validInput;

    await createBooking(inputWithTenantId);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });
});
