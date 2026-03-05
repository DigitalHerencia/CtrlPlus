import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Hoisted mocks (must appear before any imports that use them) ──────────────

const mockAuth = vi.hoisted(() => vi.fn());
const mockCurrentUser = vi.hoisted(() => vi.fn());
const mockHeaders = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  tenant: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: mockAuth,
  currentUser: mockCurrentUser,
}));

vi.mock("next/headers", () => ({
  headers: mockHeaders,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

// ── Import under test (after mocks are registered) ───────────────────────────

import { getSession, extractSubdomain } from "../session";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeClerkUser(overrides?: {
  primaryEmailAddressId?: string | null;
  emailAddresses?: Array<{ id: string; emailAddress: string }>;
}) {
  return {
    primaryEmailAddressId: overrides?.primaryEmailAddressId ?? "email_1",
    emailAddresses: overrides?.emailAddresses ?? [
      { id: "email_1", emailAddress: "alice@acme.com" },
      { id: "email_2", emailAddress: "alice+alt@acme.com" },
    ],
  };
}

function makeHeadersMap(host: string) {
  return {
    get: (key: string) => (key === "host" ? host : null),
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("getSession", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ── Unauthenticated cases ─────────────────────────────────────────────────

  it("returns null user and empty tenantId when Clerk has no userId", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const session = await getSession();

    expect(session).toEqual({ user: null, tenantId: "" });
    expect(mockCurrentUser).not.toHaveBeenCalled();
  });

  it("returns null user and empty tenantId when currentUser() returns null", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" });
    mockCurrentUser.mockResolvedValue(null);

    const session = await getSession();

    expect(session).toEqual({ user: null, tenantId: "" });
  });

  // ── Subdomain tenant resolution ───────────────────────────────────────────

  it("resolves tenantId from subdomain and returns authenticated session", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_abc" });
    mockCurrentUser.mockResolvedValue(makeClerkUser());
    mockHeaders.mockResolvedValue(makeHeadersMap("acme.ctrlplus.com"));
    mockPrisma.tenant.findUnique.mockResolvedValue({ id: "tenant-acme-1" });

    const session = await getSession();

    expect(session.user).toEqual({
      id: "clerk_abc",
      clerkUserId: "clerk_abc",
      email: "alice@acme.com",
    });
    expect(session.tenantId).toBe("tenant-acme-1");
    expect(mockPrisma.tenant.findUnique).toHaveBeenCalledWith({
      where: { slug: "acme" },
      select: { id: true },
    });
  });

  it("resolves primary email by primaryEmailAddressId", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_xyz" });
    mockCurrentUser.mockResolvedValue(
      makeClerkUser({ primaryEmailAddressId: "email_2" })
    );
    mockHeaders.mockResolvedValue(makeHeadersMap("acme.ctrlplus.com"));
    mockPrisma.tenant.findUnique.mockResolvedValue({ id: "tenant-acme-1" });

    const session = await getSession();

    expect(session.user?.email).toBe("alice+alt@acme.com");
  });

  it("falls back to first email when primaryEmailAddressId does not match", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_xyz" });
    mockCurrentUser.mockResolvedValue(
      makeClerkUser({ primaryEmailAddressId: "email_999" })
    );
    mockHeaders.mockResolvedValue(makeHeadersMap("acme.ctrlplus.com"));
    mockPrisma.tenant.findUnique.mockResolvedValue({ id: "tenant-acme-1" });

    const session = await getSession();

    expect(session.user?.email).toBe("alice@acme.com");
  });

  it("falls back to empty string when user has no email addresses", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_xyz" });
    mockCurrentUser.mockResolvedValue(
      makeClerkUser({ primaryEmailAddressId: null, emailAddresses: [] })
    );
    mockHeaders.mockResolvedValue(makeHeadersMap("acme.ctrlplus.com"));
    mockPrisma.tenant.findUnique.mockResolvedValue({ id: "tenant-acme-1" });

    const session = await getSession();

    expect(session.user?.email).toBe("");
  });

  // ── Local development fallback ────────────────────────────────────────────

  it("uses DEV_TENANT_ID for localhost host", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_dev" });
    mockCurrentUser.mockResolvedValue(makeClerkUser());
    mockHeaders.mockResolvedValue(makeHeadersMap("localhost:3000"));
    process.env.DEV_TENANT_ID = "dev-tenant-id";

    const session = await getSession();

    expect(session.tenantId).toBe("dev-tenant-id");
    expect(mockPrisma.tenant.findUnique).not.toHaveBeenCalled();
  });

  it("uses DEV_TENANT_ID for plain hostname without dots", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_dev" });
    mockCurrentUser.mockResolvedValue(makeClerkUser());
    mockHeaders.mockResolvedValue(makeHeadersMap("myapp"));
    process.env.DEV_TENANT_ID = "local-tenant";

    const session = await getSession();

    expect(session.tenantId).toBe("local-tenant");
  });

  // ── Failure states ────────────────────────────────────────────────────────

  it("throws when DEV_TENANT_ID is missing on localhost", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_dev" });
    mockCurrentUser.mockResolvedValue(makeClerkUser());
    mockHeaders.mockResolvedValue(makeHeadersMap("localhost"));
    delete process.env.DEV_TENANT_ID;

    await expect(getSession()).rejects.toThrow(
      "DEV_TENANT_ID environment variable is required for local development"
    );
  });

  it("throws when tenant slug does not exist in database", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" });
    mockCurrentUser.mockResolvedValue(makeClerkUser());
    mockHeaders.mockResolvedValue(makeHeadersMap("unknown.ctrlplus.com"));
    mockPrisma.tenant.findUnique.mockResolvedValue(null);

    await expect(getSession()).rejects.toThrow(
      "Tenant not found for subdomain: unknown"
    );
  });

  it("does NOT accept tenantId from client input (no tenantId parameter)", () => {
    // getSession() signature must not accept any tenantId parameter.
    // This is a compile-time guarantee, but we verify the public API here.
    expect(getSession.length).toBe(0);
  });

  it("propagates database errors from tenant lookup", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" });
    mockCurrentUser.mockResolvedValue(makeClerkUser());
    mockHeaders.mockResolvedValue(makeHeadersMap("acme.ctrlplus.com"));
    mockPrisma.tenant.findUnique.mockRejectedValue(new Error("DB timeout"));

    await expect(getSession()).rejects.toThrow("DB timeout");
  });
});

// ── extractSubdomain unit tests ───────────────────────────────────────────────

describe("extractSubdomain", () => {
  it("extracts subdomain from a standard subdomain host", () => {
    expect(extractSubdomain("acme.ctrlplus.com")).toBe("acme");
  });

  it("extracts subdomain when port is present", () => {
    expect(extractSubdomain("shop.ctrlplus.com:3000")).toBe("shop");
  });

  it("returns null for localhost without port", () => {
    expect(extractSubdomain("localhost")).toBeNull();
  });

  it("returns null for localhost with port", () => {
    expect(extractSubdomain("localhost:3000")).toBeNull();
  });

  it("returns null for plain hostname with no dots", () => {
    expect(extractSubdomain("myapp")).toBeNull();
  });

  it("returns null for IPv4 address", () => {
    expect(extractSubdomain("127.0.0.1")).toBeNull();
  });

  it("returns null for IPv4 address with port", () => {
    expect(extractSubdomain("192.168.1.1:8080")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractSubdomain("")).toBeNull();
  });

  it("extracts subdomain from multi-part host (deep subdomain)", () => {
    // First label is always used as the tenant slug
    expect(extractSubdomain("tenant.staging.ctrlplus.com")).toBe("tenant");
  });
});
