import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: assertTenantMembershipMock,
}));

import { assertAdminOrOwner } from "../rbac";

describe("assertAdminOrOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates tenant and user checks to assertTenantMembership with admin minimum role", async () => {
    assertTenantMembershipMock.mockResolvedValue(undefined);

    await expect(assertAdminOrOwner()).resolves.toBeUndefined();

    expect(assertTenantMembershipMock).toHaveBeenCalledWith();
  });

  it("rethrows authorization failures from assertTenantMembership", async () => {
    assertTenantMembershipMock.mockRejectedValue(new Error("Forbidden: insufficient role"));

    await expect(assertAdminOrOwner()).rejects.toThrow("Forbidden");
  });
});

const { assertTenantMembershipMock } = vi.hoisted(() => ({
  assertTenantMembershipMock: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: assertTenantMembershipMock,
}));

describe("assertAdminOrOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates tenant and user checks to assertTenantMembership with admin minimum role", async () => {
    assertTenantMembershipMock.mockResolvedValue(undefined);

    await expect(assertAdminOrOwner()).resolves.toBeUndefined();

    expect(assertTenantMembershipMock).toHaveBeenCalledWith("tenant-abc", "user-001", "admin");
  });

  it("rethrows authorization failures from assertTenantMembership", async () => {
    assertTenantMembershipMock.mockRejectedValue(new Error("Forbidden: insufficient role"));

    await expect(assertAdminOrOwner()).rejects.toThrow("Forbidden");
  });
});
