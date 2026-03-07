import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/tenancy/resolve", () => ({
  resolveTenantFromRequest: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    tenantUserMembership: {
      findFirst: vi.fn(),
    },
  },
}));

import { getSession, requireAuth } from "../session";

function mockAuth(opts: { userId?: string | null; orgId?: string | null } = {}) {
  vi.mocked(auth).mockResolvedValue({
    userId: opts.userId ?? null,
    orgId: opts.orgId ?? null,
  } as never);
}

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the resolved tenant when subdomain lookup succeeds", async () => {
    mockAuth({ userId: "user-clerk-123", orgId: "org-456" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue("tenant-abc");

    const session = await getSession();

    expect(session).toMatchObject({
      userId: "user-clerk-123",
      tenantId: "tenant-abc",
      isAuthenticated: true,
      orgId: "org-456",
    });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.tenantUserMembership.findFirst).not.toHaveBeenCalled();
  });

  it("returns an unauthenticated session when Clerk has no user", async () => {
    mockAuth({ userId: null });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);

    const session = await getSession();

    expect(session).toEqual({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });
  });

  it("falls back to the user's first tenant when host resolution is empty", async () => {
    mockAuth({ userId: "user-123" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "db-user-1" } as never);
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue({
      tenantId: "tenant-from-membership",
    } as never);

    const session = await getSession();

    expect(session.tenantId).toBe("tenant-from-membership");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { clerkUserId: "user-123" },
      select: { id: true },
    });
    expect(prisma.tenantUserMembership.findFirst).toHaveBeenCalledWith({
      where: {
        userId: "db-user-1",
        deletedAt: null,
      },
      select: { tenantId: true },
      orderBy: { createdAt: "asc" },
    });
  });

  it("returns an empty tenantId when fallback membership lookup misses", async () => {
    mockAuth({ userId: "user-123" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const session = await getSession();

    expect(session.tenantId).toBe("");
    expect(prisma.tenantUserMembership.findFirst).not.toHaveBeenCalled();
  });
});

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a session with a non-null userId when authenticated", async () => {
    mockAuth({ userId: "user-123" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue("tenant-abc");

    const session = await requireAuth();

    expect(session.userId).toBe("user-123");
    expect(session.tenantId).toBe("tenant-abc");
    expect(session.isAuthenticated).toBe(true);
  });

  it("throws when the user is not authenticated", async () => {
    mockAuth({ userId: null });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);

    await expect(requireAuth()).rejects.toThrow("Unauthorized: not authenticated");
  });
});
