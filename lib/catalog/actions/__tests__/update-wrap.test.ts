import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateWrap } from "../update-wrap";

vi.mock("@/lib/auth/session", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: { updateMany: vi.fn(), findFirst: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

const mockSession = { userId: "user-1", tenantId: "tenant-1", isAuthenticated: true, orgId: null };

const updatedWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  name: "Updated Wrap",
  description: null,
  price: 2000,
  installationMinutes: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
  images: [],
  categoryMappings: [],
};

describe("updateWrap", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(result).toMatchObject({
      id: "wrap-1",
      name: "Updated Wrap",
      images: [],
      categories: [],
    });
  });

  it("scopes the atomic update by id, tenantId, and deletedAt", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(prisma.wrap.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "wrap-1", tenantId: "tenant-1", deletedAt: null }),
      }),
    );
    expect(prisma.wrap.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "wrap-1", tenantId: "tenant-1", deletedAt: null }),
      }),
    );
  });
});
