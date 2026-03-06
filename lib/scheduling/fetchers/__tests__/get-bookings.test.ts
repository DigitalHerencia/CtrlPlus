import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingStatus } from "../../types";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getBookingsForTenant, getBookingById, getUpcomingBookingCount } from "../get-bookings";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeBookingRecord(overrides: Partial<ReturnType<typeof baseRecord>> = {}) {
  return { ...baseRecord(), ...overrides };
}

function baseRecord() {
  return {
    id: "booking-1",
    tenantId: "tenant-a",
    customerId: "customer-1",
    wrapId: "wrap-1",
    startTime: NOW,
    endTime: new Date(NOW.getTime() + 4 * 60 * 60 * 1000),
    status: BookingStatus.PENDING,
    totalPrice: 1500,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  };
}

// ── getBookingsForTenant ──────────────────────────────────────────────────────

describe("getBookingsForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with tenant scope and soft-delete filter", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([makeBookingRecord()]);
    vi.mocked(prisma.booking.count).mockResolvedValue(1);

    await getBookingsForTenant("tenant-a");

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      }),
    );
    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      }),
    );
  });

  it("returns items mapped to DTOs (no deletedAt exposed)", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([makeBookingRecord()]);
    vi.mocked(prisma.booking.count).mockResolvedValue(1);

    const result = await getBookingsForTenant("tenant-a");

    expect(result.items).toHaveLength(1);
    const dto = result.items[0];
    expect(dto.id).toBe("booking-1");
    expect(dto.tenantId).toBe("tenant-a");
    expect(dto.status).toBe("pending");
    expect("deletedAt" in dto).toBe(false);
  });

  it("applies pagination correctly", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(45);

    const result = await getBookingsForTenant("tenant-a", { page: 2, pageSize: 10 });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 }),
    );
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(5);
  });

  it("filters by status when provided", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    await getBookingsForTenant("tenant-a", {
      page: 1,
      pageSize: 20,
      status: "confirmed",
    });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: BookingStatus.CONFIRMED }),
      }),
    );
  });

  it("applies optional date range filter via startTime", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    await getBookingsForTenant("tenant-a", { page: 1, pageSize: 20, fromDate: from, toDate: to });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startTime: expect.objectContaining({ gte: from, lte: to }),
        }),
      }),
    );
  });

  it("orders results by startTime ascending", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    await getBookingsForTenant("tenant-a");

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { startTime: "asc" } }),
    );
  });

  it("returns empty list when no bookings exist", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    const result = await getBookingsForTenant("tenant-a");

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });
});

// ── getBookingById ────────────────────────────────────────────────────────────

describe("getBookingById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with id, tenantId, and soft-delete filter", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(makeBookingRecord());

    await getBookingById("tenant-a", "booking-1");

    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "booking-1",
          tenantId: "tenant-a",
          deletedAt: null,
        },
      }),
    );
  });

  it("returns null when booking not found", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(null);

    const result = await getBookingById("tenant-a", "booking-1");
    expect(result).toBeNull();
  });

  it("returns DTO when booking exists", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(makeBookingRecord());

    const result = await getBookingById("tenant-a", "booking-1");
    expect(result?.id).toBe("booking-1");
    expect(result?.startTime).toEqual(NOW);
  });
});

// ── getUpcomingBookingCount ───────────────────────────────────────────────────

describe("getUpcomingBookingCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("counts only future, non-terminal bookings scoped to tenant", async () => {
    vi.mocked(prisma.booking.count).mockResolvedValue(5);
    const from = new Date("2025-02-01");

    const result = await getUpcomingBookingCount("tenant-a", from);

    expect(result).toBe(5);
    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
          status: {
            notIn: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
          },
          startTime: { gte: from },
        }),
      }),
    );
  });
});
