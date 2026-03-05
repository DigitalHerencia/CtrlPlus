import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingStatus } from "@prisma/client";

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
import {
  getBookingsForTenant,
  getBookingById,
  getUpcomingBookingCount,
} from "../get-bookings";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeBookingRecord(
  overrides: Partial<ReturnType<typeof baseRecord>> = {}
) {
  return { ...baseRecord(), ...overrides };
}

function baseRecord() {
  return {
    id: "booking-1",
    tenantId: "tenant-a",
    customerId: "customer-1",
    wrapId: "wrap-1",
    dropOffStart: NOW,
    dropOffEnd: new Date(NOW.getTime() + 60 * 60 * 1000),
    pickUpStart: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
    pickUpEnd: new Date(NOW.getTime() + 25 * 60 * 60 * 1000),
    status: BookingStatus.PENDING,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

// ── getBookingsForTenant ──────────────────────────────────────────────────────

describe("getBookingsForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with tenant scope and soft-delete filter", async () => {
    const record = makeBookingRecord();
    vi.mocked(prisma.booking.findMany).mockResolvedValue([record]);
    vi.mocked(prisma.booking.count).mockResolvedValue(1);

    await getBookingsForTenant("tenant-a");

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      })
    );
    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      })
    );
  });

  it("returns items mapped to DTOs (no deletedAt exposed)", async () => {
    const record = makeBookingRecord();
    vi.mocked(prisma.booking.findMany).mockResolvedValue([record]);
    vi.mocked(prisma.booking.count).mockResolvedValue(1);

    const result = await getBookingsForTenant("tenant-a");

    expect(result.items).toHaveLength(1);
    const dto = result.items[0];
    expect(dto.id).toBe("booking-1");
    expect(dto.tenantId).toBe("tenant-a");
    expect(dto.status).toBe(BookingStatus.PENDING);
    expect("deletedAt" in dto).toBe(false);
  });

  it("applies pagination correctly", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(55);

    const result = await getBookingsForTenant("tenant-a", {
      page: 3,
      pageSize: 10,
    });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    );
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
    expect(result.total).toBe(55);
    expect(result.totalPages).toBe(6);
  });

  it("applies optional status filter", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    await getBookingsForTenant("tenant-a", {
      page: 1,
      pageSize: 20,
      status: BookingStatus.CONFIRMED,
    });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: BookingStatus.CONFIRMED }),
      })
    );
  });

  it("applies optional date range filter", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    const from = new Date("2025-01-01");
    const to = new Date("2025-01-31");

    await getBookingsForTenant("tenant-a", {
      page: 1,
      pageSize: 20,
      fromDate: from,
      toDate: to,
    });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dropOffStart: expect.objectContaining({ gte: from, lte: to }),
        }),
      })
    );
  });

  it("orders results by dropOffStart ascending", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([]);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);

    await getBookingsForTenant("tenant-a");

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { dropOffStart: "asc" } })
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
    const record = makeBookingRecord();
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(record);

    await getBookingById("tenant-a", "booking-1");

    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "booking-1",
          tenantId: "tenant-a",
          deletedAt: null,
        },
      })
    );
  });

  it("returns mapped DTO when record exists", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(makeBookingRecord());

    const result = await getBookingById("tenant-a", "booking-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("booking-1");
  });

  it("returns null when record not found or belongs to another tenant", async () => {
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(null);

    const result = await getBookingById("tenant-b", "booking-1");

    expect(result).toBeNull();
  });
});

// ── getUpcomingBookingCount ───────────────────────────────────────────────────

describe("getUpcomingBookingCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("counts non-deleted, non-terminal bookings starting from now", async () => {
    vi.mocked(prisma.booking.count).mockResolvedValue(3);

    const from = new Date("2025-01-15T09:00:00.000Z");
    const result = await getUpcomingBookingCount("tenant-a", from);

    expect(prisma.booking.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
          status: {
            notIn: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
          },
          dropOffStart: { gte: from },
        }),
      })
    );
    expect(result).toBe(3);
  });
});
