import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    availabilityRule: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getAvailabilityWindowsForTenant,
  getAvailabilityWindowById,
  getAvailabilityWindowsByDay,
} from "../get-availability";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeWindowRecord(overrides: Partial<ReturnType<typeof baseWindowRecord>> = {}) {
  return { ...baseWindowRecord(), ...overrides };
}

function baseWindowRecord() {
  return {
    id: "window-1",
    tenantId: "tenant-a",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    capacitySlots: 2,
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

// ── getAvailabilityWindowsForTenant ──────────────────────────────────────────

describe("getAvailabilityWindowsForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with tenant scope and soft-delete filter", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityWindowsForTenant("tenant-a");

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      }),
    );
    expect(prisma.availabilityRule.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-a",
          deletedAt: null,
        }),
      }),
    );
  });

  it("does not filter by isActive (field not on model)", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityWindowsForTenant("tenant-a");

    const call = vi.mocked(prisma.availabilityRule.findMany).mock.calls[0][0];
    expect(call?.where).not.toHaveProperty("isActive");
  });

  it("does not filter by isActive when called without activeOnly", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityWindowsForTenant("tenant-a", {
      page: 1,
      pageSize: 20,
    });

    const call = vi.mocked(prisma.availabilityRule.findMany).mock.calls[0][0];
    expect(call?.where).not.toHaveProperty("isActive");
  });

  it("returns items mapped to DTOs (no deletedAt exposed)", async () => {
    const record = makeWindowRecord();
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([record]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(1);

    const result = await getAvailabilityWindowsForTenant("tenant-a");

    expect(result.items).toHaveLength(1);
    const dto = result.items[0];
    expect(dto.id).toBe("window-1");
    expect(dto.dayOfWeek).toBe(1);
    expect(dto.startTime).toBe("09:00");
    expect(dto.endTime).toBe("17:00");
    expect(dto.capacitySlots).toBe(2);
    expect("deletedAt" in dto).toBe(false);
  });

  it("applies optional dayOfWeek filter", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityWindowsForTenant("tenant-a", {
      page: 1,
      pageSize: 20,
      dayOfWeek: 3,
    });

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ dayOfWeek: 3 }),
      }),
    );
  });

  it("applies pagination correctly", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(45);

    const result = await getAvailabilityWindowsForTenant("tenant-a", {
      page: 2,
      pageSize: 10,
    });

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(5);
  });

  it("orders by dayOfWeek then startTime ascending", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityWindowsForTenant("tenant-a");

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      }),
    );
  });
});

// ── getAvailabilityWindowById ─────────────────────────────────────────────────

describe("getAvailabilityWindowById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with id, tenantId, and soft-delete filter", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(makeWindowRecord());

    await getAvailabilityWindowById("tenant-a", "window-1");

    expect(prisma.availabilityRule.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "window-1",
          tenantId: "tenant-a",
          deletedAt: null,
        },
      }),
    );
  });

  it("returns mapped DTO when record exists", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(makeWindowRecord());

    const result = await getAvailabilityWindowById("tenant-a", "window-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("window-1");
    expect(result?.tenantId).toBe("tenant-a");
  });

  it("returns null when record not found or belongs to another tenant", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(null);

    const result = await getAvailabilityWindowById("tenant-b", "window-1");

    expect(result).toBeNull();
  });
});

// ── getAvailabilityWindowsByDay ───────────────────────────────────────────────

describe("getAvailabilityWindowsByDay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries non-deleted rules for the given day", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);

    await getAvailabilityWindowsByDay("tenant-a", 2);

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId: "tenant-a",
          dayOfWeek: 2,
          deletedAt: null,
        },
      }),
    );
  });

  it("orders results by startTime ascending", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);

    await getAvailabilityWindowsByDay("tenant-a", 5);

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { startTime: "asc" } }),
    );
  });

  it("returns DTOs for all matching windows", async () => {
    const records = [
      makeWindowRecord({ id: "w-1", startTime: "09:00" }),
      makeWindowRecord({ id: "w-2", startTime: "14:00" }),
    ];
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue(records);

    const result = await getAvailabilityWindowsByDay("tenant-a", 1);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("w-1");
    expect(result[1].id).toBe("w-2");
  });
});
