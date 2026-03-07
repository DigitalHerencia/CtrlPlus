import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirstMock, headersMock } = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  headersMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      findFirst: findFirstMock,
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

import { extractTenantSlugFromHost, resolveTenantFromRequest } from "../resolve";

describe("extractTenantSlugFromHost", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX;
  });

  it("extracts a tenant from localhost subdomains", () => {
    expect(extractTenantSlugFromHost("tenant.localhost:3000")).toBe("tenant");
  });

  it("extracts a tenant from configured suffix domains", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";

    expect(extractTenantSlugFromHost("tenant.ctrlplus.local")).toBe("tenant");
  });

  it("returns null for base suffix host with no subdomain", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";

    expect(extractTenantSlugFromHost("ctrlplus.local")).toBeNull();
  });

  it("returns null for ngrok-free hosts", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";
    process.env.ALLOW_NGROK_TENANT_HOST_RESOLUTION = "true";

    expect(extractTenantSlugFromHost("demo.ngrok-free.app", ".ngrok-free.app")).toBe("demo");

    expect(extractTenantSlugFromHost("random.ngrok-free.app")).toBeNull();
  });

  it("returns null for hosts outside the configured suffix allowlist", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";

    expect(extractTenantSlugFromHost("tenant.example.com")).toBeNull();
  });
});

describe("resolveTenantFromRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";
  });

  it("does not query the DB when the host has no tenant subdomain match", async () => {
    headersMock.mockResolvedValue({
      get: vi.fn().mockReturnValue("ctrlplus.local"),
    });

    await expect(resolveTenantFromRequest()).resolves.toBeNull();
    expect(findFirstMock).not.toHaveBeenCalled();
  });

  it("queries by subdomain when the host has a valid tenant match", async () => {
    headersMock.mockResolvedValue({
      get: vi.fn().mockReturnValue("tenant.ctrlplus.local"),
    });
    findFirstMock.mockResolvedValue({ id: "tenant-id" });

    await expect(resolveTenantFromRequest()).resolves.toBe("tenant-id");
    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        slug: "tenant",
        deletedAt: null,
      },
      select: { id: true },
    });
  });
});
