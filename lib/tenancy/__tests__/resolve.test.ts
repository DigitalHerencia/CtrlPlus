import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { extractTenantSlugFromHost } from "../resolve";

describe("extractTenantSlugFromHost", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX;
  });

  it("extracts the tenant from configured production domains", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.com";

    expect(extractTenantSlugFromHost("acme.ctrlplus.com")).toBe("acme");
  });

  it("extracts the tenant from localhost subdomains", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";

    expect(extractTenantSlugFromHost("acme.localhost:3000")).toBe("acme");
  });

  it("rejects ngrok-free.app hosts for tenant parsing", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";

    expect(extractTenantSlugFromHost("demo.ngrok-free.app")).toBeNull();
  });


  it("can explicitly allow ngrok tenant parsing when enabled", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";
    process.env.ALLOW_NGROK_TENANT_HOST_RESOLUTION = "true";

    expect(extractTenantSlugFromHost("demo.ngrok-free.app", ".ngrok-free.app")).toBe("demo");

    delete process.env.ALLOW_NGROK_TENANT_HOST_RESOLUTION;
  });

  it("rejects arbitrary public hosts outside the configured tenant suffix", () => {
    process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX = ".ctrlplus.local";

    expect(extractTenantSlugFromHost("tenant.example.com")).toBeNull();
    expect(extractTenantSlugFromHost("ctrlplus.local")).toBeNull();
  });
});
