import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────
// assertAdminOrOwner delegates to assertTenantMembership which queries prisma,
// so we mock prisma directly rather than the tenancy module.

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenantUserMembership: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { assertAdminOrOwner } from "../rbac";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function membershipRecord(role: string) {
  return { role };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("assertAdminOrOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves when user has admin role", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(
      membershipRecord("admin"),
    );

    await expect(
      assertAdminOrOwner("tenant-abc", "user-001"),
    ).resolves.toBeUndefined();
  });

  it("resolves when user has owner role (satisfies admin requirement via hierarchy)", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(
      membershipRecord("owner"),
    );

    await expect(
      assertAdminOrOwner("tenant-abc", "user-001"),
    ).resolves.toBeUndefined();
  });

  it("throws Forbidden when user has member role", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(
      membershipRecord("member"),
    );

    await expect(assertAdminOrOwner("tenant-abc", "user-001")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws Forbidden when user has no membership in the tenant", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(null);

    await expect(assertAdminOrOwner("tenant-abc", "user-001")).rejects.toThrow(
      "Forbidden",
    );
  });
});
