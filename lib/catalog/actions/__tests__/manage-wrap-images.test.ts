import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/catalog/image-storage", () => ({
  validateWrapImageFile: vi.fn(),
  persistWrapImage: vi.fn(),
  deletePersistedWrapImage: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: { findFirst: vi.fn() },
    wrapImage: {
      aggregate: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    auditLog: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

import { requireAuth } from "@/lib/auth/session";
import { persistWrapImage } from "@/lib/catalog/image-storage";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { addWrapImage } from "../manage-wrap-images";

const session = { userId: "u-1", tenantId: "t-1", isAuthenticated: true, orgId: null };

describe("manage-wrap-images", () => {
  beforeEach(() => vi.clearAllMocks());

  it("adds image with tenant-scoped wrap check", async () => {
    vi.mocked(requireAuth).mockResolvedValue(session);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue({ id: "w-1" } as never);
    vi.mocked(persistWrapImage).mockResolvedValue("/uploads/wraps/a.jpg");
    vi.mocked(prisma.wrapImage.aggregate).mockResolvedValue({ _max: { displayOrder: 1 } } as never);
    vi.mocked(prisma.wrapImage.create).mockResolvedValue({
      id: "img-1",
      url: "/uploads/wraps/a.jpg",
      displayOrder: 2,
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const file = new File([new Uint8Array([1, 2, 3])], "wrap.jpg", { type: "image/jpeg" });
    const image = await addWrapImage({ wrapId: "w-1", file });

    expect(image.id).toBe("img-1");
    expect(prisma.wrap.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ tenantId: "t-1" }) }),
    );
  });
});
