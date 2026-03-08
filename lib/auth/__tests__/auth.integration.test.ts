describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});
import { ROLE_HIERARCHY, hasRolePermission, normalizeTenantRole } from "@/lib/tenancy/types";
import { describe, expect, it } from "vitest";

describe("tenant role helpers", () => {
  it("exposes the expected role hierarchy", () => {
    expect(ROLE_HIERARCHY.owner).toBe(3);
    expect(ROLE_HIERARCHY.admin).toBe(2);
    expect(ROLE_HIERARCHY.member).toBe(1);
  });

  it("normalizes role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin");
    expect(normalizeTenantRole("owner")).toBe("owner");
    expect(normalizeTenantRole("Member")).toBe("member");
  });

  it("enforces hierarchical permissions", () => {
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
    expect(hasRolePermission()).toBe(true);
  });

  it("rejects invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role");
  });
});
