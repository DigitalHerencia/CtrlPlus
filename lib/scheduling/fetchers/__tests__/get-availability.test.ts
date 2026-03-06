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
  getAvailabilityRulesForTenant,
  getAvailabilityRuleById,
  getAvailabilityRulesByDay,
} from "../get-availability";

// ── Helpers ───────────────────────────────────────────────────────────────────

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeRuleRecord(overrides: Partial<ReturnType<typeof baseRuleRecord>> = {}) {
  return { ...baseRuleRecord(), ...overrides };
}

function baseRuleRecord() {
  return {
    id: "rule-1",
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

// ── getAvailabilityRulesForTenant ─────────────────────────────────────────────

describe("getAvailabilityRulesForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with tenant scope and soft-delete filter", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityRulesForTenant("tenant-a");

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

  it("returns items mapped to DTOs (no deletedAt exposed)", async () => {
    const record = makeRuleRecord();
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([record]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(1);

    const result = await getAvailabilityRulesForTenant("tenant-a");

    expect(result.items).toHaveLength(1);
    const dto = result.items[0];
    expect(dto.id).toBe("rule-1");
    expect(dto.dayOfWeek).toBe(1);
    expect(dto.startTime).toBe("09:00");
    expect(dto.endTime).toBe("17:00");
    expect(dto.capacitySlots).toBe(2);
    expect("deletedAt" in dto).toBe(false);
  });

  it("applies optional dayOfWeek filter", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);
    vi.mocked(prisma.availabilityRule.count).mockResolvedValue(0);

    await getAvailabilityRulesForTenant("tenant-a", {
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

    const result = await getAvailabilityRulesForTenant("tenant-a", {
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

    await getAvailabilityRulesForTenant("tenant-a");

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      }),
    );
  });
});

// ── getAvailabilityRuleById ───────────────────────────────────────────────────

describe("getAvailabilityRuleById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries with id, tenantId, and soft-delete filter", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(makeRuleRecord());

    await getAvailabilityRuleById("tenant-a", "rule-1");

    expect(prisma.availabilityRule.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "rule-1",
          tenantId: "tenant-a",
          deletedAt: null,
        },
      }),
    );
  });

  it("returns mapped DTO when record exists", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(makeRuleRecord());

    const result = await getAvailabilityRuleById("tenant-a", "rule-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("rule-1");
    expect(result?.tenantId).toBe("tenant-a");
  });

  it("returns null when record not found or belongs to another tenant", async () => {
    vi.mocked(prisma.availabilityRule.findFirst).mockResolvedValue(null);

    const result = await getAvailabilityRuleById("tenant-b", "rule-1");

    expect(result).toBeNull();
  });
});

// ── getAvailabilityRulesByDay ─────────────────────────────────────────────────

describe("getAvailabilityRulesByDay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries non-deleted rules for the given day", async () => {
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue([]);

    await getAvailabilityRulesByDay("tenant-a", 2);

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

    await getAvailabilityRulesByDay("tenant-a", 5);

    expect(prisma.availabilityRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { startTime: "asc" } }),
    );
  });

  it("returns DTOs for all matching rules", async () => {
    const records = [
      makeRuleRecord({ id: "r-1", startTime: "09:00" }),
      makeRuleRecord({ id: "r-2", startTime: "14:00" }),
    ];
    vi.mocked(prisma.availabilityRule.findMany).mockResolvedValue(records);

    const result = await getAvailabilityRulesByDay("tenant-a", 1);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("r-1");
    expect(result[1].id).toBe("r-2");
  });
});
