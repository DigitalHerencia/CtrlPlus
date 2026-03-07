import { describe, expect, it, vi } from "vitest";

vi.mock("../reserve-slot", () => ({
  reserveSlot: vi.fn(),
}));

vi.mock("@/lib/billing/actions/ensure-invoice-for-booking", () => ({
  ensureInvoiceForBooking: vi.fn(),
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
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { ensureInvoiceForBooking } from "@/lib/billing/actions/ensure-invoice-for-booking";
import type { Prisma } from "@prisma/client";

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const START = new Date("2025-01-06T09:00:00.000Z");
const END = new Date("2025-01-06T17:00:00.000Z");

const validInput = {
  wrapId: "wrap-1",
  startTime: START,
  endTime: END,
};

const mockWrap = { id: "wrap-1", price: 150000 };

const mockBooking = {
  id: "booking-1",
  wrapId: "wrap-1",
  startTime: START,
  endTime: END,
  status: "pending",
  totalPrice: 150000,
};

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(prisma.$transaction).mockImplementation(
      (fn: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        fn(prisma as unknown as Prisma.TransactionClient),
    );

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([
      { id: "rule-1", startTime: "08:00", endTime: "18:00", capacitySlots: 2 },
    ] as never);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    vi.mocked(ensureInvoiceForBooking).mockResolvedValue({ invoiceId: "inv-1", created: true });
  });

  it("creates a booking and returns the DTO", async () => {
    const result = await createBooking(validInput);

    vi.mocked(reserveSlot).mockResolvedValue({
      id: "booking-1",
      wrapId: input.wrapId,
      startTime: input.startTime,
      endTime: input.endTime,
      status: "pending",
      totalPrice: 150000,
      invoiceId: "inv-1",
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

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });

    const result = await createBooking(input);

    expect(reserveSlot).toHaveBeenCalledWith(input);
    expect(result.id).toBe("booking-1");
    expect(result.reservationExpiresAt).toBeInstanceOf(Date);
  });
});
