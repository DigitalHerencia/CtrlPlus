import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Clerk ────────────────────────────────────────────────────────────────
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

// ── Mock tenancy resolver ─────────────────────────────────────────────────────
vi.mock("@/lib/tenancy/resolve", () => ({
  resolveTenantFromRequest: vi.fn(),
}));

// ── Imports after mocks ───────────────────────────────────────────────────────
import { auth } from "@clerk/nextjs/server";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { getSession, requireAuth } from "../session";

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockAuth(opts: { userId?: string | null; orgId?: string | null } = {}) {
  vi.mocked(auth).mockResolvedValue({
    userId: opts.userId ?? null,
    orgId: opts.orgId ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

function mockTenantResolve(tenantId: string | null) {
  vi.mocked(resolveTenantFromRequest).mockResolvedValue(tenantId);
}

// ── getSession ────────────────────────────────────────────────────────────────

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns isAuthenticated=true with userId when signed in", async () => {
    mockAuth({ userId: "user-clerk-123", orgId: null });
    mockTenantResolve("tenant-abc");

    const session = await getSession();

    expect(session.isAuthenticated).toBe(true);
    expect(session.userId).toBe("user-clerk-123");
  });

  it("returns isAuthenticated=false when not signed in", async () => {
    mockAuth({ userId: null });
    mockTenantResolve(null);

    const session = await getSession();

    expect(session.isAuthenticated).toBe(false);
    expect(session.userId).toBeNull();
  });

  it("resolves tenantId from resolveTenantFromRequest", async () => {
    mockAuth({ userId: "user-123" });
    mockTenantResolve("tenant-xyz");

    const session = await getSession();

    expect(session.tenantId).toBe("tenant-xyz");
    expect(resolveTenantFromRequest).toHaveBeenCalledOnce();
  });

  it("returns empty string for tenantId when tenant resolution returns null", async () => {
    mockAuth({ userId: "user-123" });
    mockTenantResolve(null);

    const session = await getSession();

    expect(session.tenantId).toBe("");
  });

  it("returns orgId from Clerk auth context", async () => {
    mockAuth({ userId: "user-123", orgId: "org-456" });
    mockTenantResolve("tenant-abc");

    const session = await getSession();

    expect(session.orgId).toBe("org-456");
  });

  it("returns null orgId when not in an org context", async () => {
    mockAuth({ userId: "user-123", orgId: null });
    mockTenantResolve("tenant-abc");

    const session = await getSession();

    expect(session.orgId).toBeNull();
  });

  it("returns a well-formed SessionContext shape", async () => {
    mockAuth({ userId: "user-1", orgId: "org-1" });
    mockTenantResolve("tenant-1");

    const session = await getSession();

    expect(session).toMatchObject({
      userId: "user-1",
      tenantId: "tenant-1",
      isAuthenticated: true,
      orgId: "org-1",
    });
  });
});

// ── requireAuth ───────────────────────────────────────────────────────────────

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the session when user is authenticated", async () => {
    mockAuth({ userId: "user-123", orgId: null });
    mockTenantResolve("tenant-abc");

    const session = await requireAuth();

    expect(session.userId).toBe("user-123");
    expect(session.isAuthenticated).toBe(true);
    expect(session.tenantId).toBe("tenant-abc");
  });

  it("throws 'Unauthorized: not authenticated' when not signed in", async () => {
    mockAuth({ userId: null });
    mockTenantResolve(null);

    await expect(requireAuth()).rejects.toThrow("Unauthorized: not authenticated");
  });

  it("guarantees userId is non-null in return type for authorized requests", async () => {
    mockAuth({ userId: "user-guaranteed" });
    mockTenantResolve("tenant-1");

    const session = await requireAuth();

    // TypeScript guarantees userId is string (not null) after requireAuth
    const userId: string = session.userId;
    expect(userId).toBe("user-guaranteed");
  });

  it("calls resolveTenantFromRequest for tenant context", async () => {
    mockAuth({ userId: "user-123" });
    mockTenantResolve("tenant-from-host");

    const session = await requireAuth();

    expect(resolveTenantFromRequest).toHaveBeenCalledOnce();
    expect(session.tenantId).toBe("tenant-from-host");
  });
});
