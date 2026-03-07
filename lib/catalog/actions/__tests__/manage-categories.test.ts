import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrapCategory: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    wrap: { findFirst: vi.fn() },
    wrapCategoryMapping: { deleteMany: vi.fn(), createMany: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { createWrapCategory, setWrapCategoryMappings } from "../manage-categories";

const session = { userId: "u-1", tenantId: "t-1", isAuthenticated: true, orgId: null };

describe("manage-categories", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates category tenant-scoped", async () => {
    vi.mocked(requireAuth).mockResolvedValue(session);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrapCategory.create).mockResolvedValue({
      id: "c1",
      name: "Full",
      slug: "full",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const category = await createWrapCategory({ name: "Full", slug: "full" });

    expect(category.id).toBe("c1");
    expect(prisma.wrapCategory.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ tenantId: "t-1" }) }),
    );
  });

  it("sets mappings and rejects cross-tenant categories", async () => {
    vi.mocked(requireAuth).mockResolvedValue(session);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue({ id: "w1" } as never);
    vi.mocked(prisma.wrapCategory.findMany).mockResolvedValue([{ id: "c1" }] as never);

    await expect(
      setWrapCategoryMappings({ wrapId: "w1", categoryIds: ["c1", "c2"] }),
    ).rejects.toThrow("one or more categories not found");
  });
});
