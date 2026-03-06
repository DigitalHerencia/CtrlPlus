import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    wrap: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

const mockWrap = {
  id: "wrap-001",
  tenantId: "tenant-abc",
  name: "Matte Black Full Wrap",
  description: "Premium matte black vinyl wrap",
  price: 1200,
  installationMinutes: 480,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-02T00:00:00.000Z"),
};

// ─── Import fetchers after mock is set up ────────────────────────────────────

import { getWrapById, getWrapsForTenant, searchWraps } from "../get-wraps";

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getWrapsForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an array of WrapDTOs for the tenant", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([mockWrap]);

    const result = await getWrapsForTenant("tenant-abc");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("wrap-001");
    expect(result[0].name).toBe("Matte Black Full Wrap");
    expect(result[0].price).toBe(1200);
  });

  it("scopes the query by tenantId", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);

    await getWrapsForTenant("tenant-abc");

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
  });

  it("filters out soft-deleted wraps only (no status field in schema)", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);

    await getWrapsForTenant("tenant-abc");

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });

  it("filters out soft-deleted wraps (deletedAt: null)", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);

    await getWrapsForTenant("tenant-abc");

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });

  it("returns an empty array when no wraps exist", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);

    const result = await getWrapsForTenant("tenant-abc");

    expect(result).toEqual([]);
  });

  it("price is a number in DTO", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([mockWrap]);

    const result = await getWrapsForTenant("tenant-abc");

    expect(typeof result[0].price).toBe("number");
    expect(result[0].price).toBe(1200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("getWrapById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a WrapDTO when wrap exists for the tenant", async () => {
    prismaMock.wrap.findFirst.mockResolvedValue(mockWrap);

    const result = await getWrapById("tenant-abc", "wrap-001");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("wrap-001");
    expect(result?.tenantId).toBe("tenant-abc");
  });

  it("returns null when wrap does not exist", async () => {
    prismaMock.wrap.findFirst.mockResolvedValue(null);

    const result = await getWrapById("tenant-abc", "wrap-999");

    expect(result).toBeNull();
  });

  it("returns null when wrap belongs to a different tenant", async () => {
    prismaMock.wrap.findFirst.mockResolvedValue(null);

    const result = await getWrapById("tenant-other", "wrap-001");

    expect(result).toBeNull();
  });

  it("scopes the query by both tenantId and wrapId", async () => {
    prismaMock.wrap.findFirst.mockResolvedValue(null);

    await getWrapById("tenant-abc", "wrap-001");

    expect(prismaMock.wrap.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-abc",
          id: "wrap-001",
        }),
      }),
    );
  });

  it("filters out soft-deleted wraps", async () => {
    prismaMock.wrap.findFirst.mockResolvedValue(null);

    await getWrapById("tenant-abc", "wrap-001");

    expect(prismaMock.wrap.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
        }),
      }),
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("searchWraps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a paginated WrapListDTO", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([mockWrap]);
    prismaMock.wrap.count.mockResolvedValue(1);

    const result = await searchWraps("tenant-abc", {
      page: 1,
      pageSize: 20,
    });

    expect(result.wraps).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.totalPages).toBe(1);
  });

  it("scopes all queries by tenantId", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);
    prismaMock.wrap.count.mockResolvedValue(0);

    await searchWraps("tenant-abc", { page: 1, pageSize: 20 });

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
    expect(prismaMock.wrap.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
  });

  it("filters out soft-deleted wraps", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);
    prismaMock.wrap.count.mockResolvedValue(0);

    await searchWraps("tenant-abc", { page: 1, pageSize: 20 });

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });

  it("applies maxPrice filter when provided", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);
    prismaMock.wrap.count.mockResolvedValue(0);

    await searchWraps("tenant-abc", {
      maxPrice: 1500,
      page: 1,
      pageSize: 20,
    });

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ price: { lte: 1500 } }),
      }),
    );
  });

  it("applies text search via OR on name and description", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);
    prismaMock.wrap.count.mockResolvedValue(0);

    await searchWraps("tenant-abc", {
      query: "matte",
      page: 1,
      pageSize: 20,
    });

    expect(prismaMock.wrap.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({ contains: "matte" }),
            }),
            expect.objectContaining({
              description: expect.objectContaining({ contains: "matte" }),
            }),
          ]),
        }),
      }),
    );
  });

  it("computes correct totalPages", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);
    prismaMock.wrap.count.mockResolvedValue(45);

    const result = await searchWraps("tenant-abc", { page: 1, pageSize: 20 });

    expect(result.totalPages).toBe(3);
  });

  it("uses default pagination when no filters are provided", async () => {
    prismaMock.wrap.findMany.mockResolvedValue([]);
    prismaMock.wrap.count.mockResolvedValue(0);

    const result = await searchWraps("tenant-abc");

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });
});
