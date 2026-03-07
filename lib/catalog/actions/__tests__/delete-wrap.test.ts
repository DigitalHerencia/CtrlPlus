import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteWrap } from "../delete-wrap";

vi.mock("@/lib/auth/session", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: { findFirst: vi.fn(), update: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";

const mockSession = { userId: "user-1", tenantId: "tenant-1", isAuthenticated: true, orgId: null };

const existingWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  name: "Carbon Fiber Full Wrap",
  description: null,
  price: 1500,
  installationMinutes: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
};

const softDeletedWrap = { ...existingWrap, deletedAt: new Date() };

describe("deleteWrap", () => {
  beforeEach(() => vi.clearAllMocks());

  it("soft-deletes a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(softDeletedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await deleteWrap("wrap-1");

    expect(result).toMatchObject({
      id: "wrap-1",
      tenantId: "tenant-1",
      images: [],
      categories: [],
    });
  });
});
