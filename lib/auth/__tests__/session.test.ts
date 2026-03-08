import { auth } from "@clerk/nextjs/server";
import {
  getActiveLocalUserByClerkId,
  getActiveTenantMembershipsByUserId,
} from "@/lib/auth/local-user";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react", () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/auth/local-user", () => ({
  getActiveLocalUserByClerkId: vi.fn(),
  getActiveTenantMembershipsByUserId: vi.fn(),
}));

vi.mock("@/lib/tenancy/resolve", () => ({
  resolveTenantFromRequest: vi.fn(),
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
    vi.mocked(getActiveLocalUserByClerkId).mockResolvedValue({ id: "db-user-1" });

    const session = await getSession();

    expect(session).toMatchObject({
      userId: "user-clerk-123",
      tenantId: "tenant-abc",
      isAuthenticated: true,
      orgId: "org-456",
    });
    expect(getActiveLocalUserByClerkId).toHaveBeenCalledWith("user-clerk-123");
    expect(getActiveTenantMembershipsByUserId).not.toHaveBeenCalled();
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
    mockAuth({ userId: "user-fallback" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);
    vi.mocked(getActiveLocalUserByClerkId).mockResolvedValue({ id: "db-user-1" });
    vi.mocked(getActiveTenantMembershipsByUserId).mockResolvedValue([
      { tenantId: "tenant-from-membership", role: "owner" },
    ]);

    const session = await getSession();

    expect(session.tenantId).toBe("tenant-from-membership");
    expect(getActiveLocalUserByClerkId).toHaveBeenCalledWith("user-fallback");
    expect(getActiveTenantMembershipsByUserId).toHaveBeenCalledWith("db-user-1");
  });

  it("returns an empty tenantId when the local user is missing", async () => {
    mockAuth({ userId: "user-missing" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);
    vi.mocked(getActiveLocalUserByClerkId).mockResolvedValue(null);

    const session = await getSession();

    expect(session.tenantId).toBe("");
    expect(session.isAuthenticated).toBe(false);
    expect(getActiveTenantMembershipsByUserId).not.toHaveBeenCalled();
  });

  it("does not choose a fallback tenant when the user belongs to multiple workspaces", async () => {
    mockAuth({ userId: "user-multi" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);
    vi.mocked(getActiveLocalUserByClerkId).mockResolvedValue({ id: "db-user-1" });
    vi.mocked(getActiveTenantMembershipsByUserId).mockResolvedValue([
      { tenantId: "tenant-a", role: "owner" },
      { tenantId: "tenant-b", role: "member" },
    ]);

    const session = await getSession();

    expect(session.tenantId).toBe("");
  });
});

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a session with a non-null userId when authenticated", async () => {
    mockAuth({ userId: "user-authenticated" });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue("tenant-abc");
    vi.mocked(getActiveLocalUserByClerkId).mockResolvedValue({ id: "db-user-1" });

    const session = await requireAuth();

    expect(session.userId).toBe("user-authenticated");
    expect(session.tenantId).toBe("tenant-abc");
    expect(session.isAuthenticated).toBe(true);
  });

  it("throws when the user is not authenticated", async () => {
    mockAuth({ userId: null });
    vi.mocked(resolveTenantFromRequest).mockResolvedValue(null);

    await expect(requireAuth()).rejects.toThrow("Unauthorized: not authenticated");
  });
});
