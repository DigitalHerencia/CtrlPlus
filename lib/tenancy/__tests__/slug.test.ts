import { describe, expect, it } from "vitest";

import { generateTenantSlug } from "../slug";

describe("generateTenantSlug", () => {
  it("produces dns-safe lowercase slugs", () => {
    const slug = generateTenantSlug({ workspaceName: "Acme_Design Studio!!!" });

    expect(slug).toBe("acme-design-studio");
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("enforces max label length", () => {
    const slug = generateTenantSlug({ workspaceName: "A".repeat(120) });

    expect(slug.length).toBeLessThanOrEqual(63);
  });

  it("falls back to email-derived candidate", () => {
    const slug = generateTenantSlug({ workspaceName: "***", email: "Owner@WrapShop.com" });

    expect(slug).toBe("owner-wrapshop");
  });

  it("uses tenant short-id fallback when no candidate is valid", () => {
    const slug = generateTenantSlug({ workspaceName: "___", email: "@@@" });

    expect(slug).toMatch(/^tenant-[a-z0-9]{8}$/);
  });
});
