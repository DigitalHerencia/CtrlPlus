import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWrap } from "../create-wrap";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  user: { id: "user-1", clerkUserId: "clerk-1", email: "admin@example.com" },
  tenantId: "tenant-1",
  isAuthenticated: true,
  userId: "user-1",
};

const validInput = {
  name: "Carbon Fiber Full Wrap",
  description: "Premium carbon fiber wrap",
  price: 1500,
  installationMinutes: 480,
};

const mockWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  name: "Carbon Fiber Full Wrap",
  description: "Premium carbon fiber wrap",
  price: 1500,
  installationMinutes: 480,
  deletedAt: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createWrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.create).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await createWrap(validInput);

    expect(result).toMatchObject({
      id: "wrap-1",
      tenantId: "tenant-1",
      name: "Carbon Fiber Full Wrap",
      price: 1500,
    });
  });

  it("scopes the mutation to the current tenantId", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.create).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createWrap(validInput);

    expect(prisma.wrap.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });

  it("writes an audit log entry after creating the wrap", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.create).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createWrap(validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CREATE_WRAP",
          tenantId: "tenant-1",
          userId: "user-1",
          resourceId: "wrap-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      user: null,
      tenantId: "",
      isAuthenticated: false,
      userId: "",
    });

    await expect(createWrap(validInput)).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(createWrap(validInput)).rejects.toThrow("Forbidden");
  });

  it("throws a ZodError for invalid input (missing name)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { ...validInput, name: "" };

    await expect(createWrap(badInput)).rejects.toThrow();
    expect(prisma.wrap.create).not.toHaveBeenCalled();
  });

  it("throws a ZodError for invalid input (negative price)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { ...validInput, price: -100 };

    await expect(createWrap(badInput)).rejects.toThrow();
    expect(prisma.wrap.create).not.toHaveBeenCalled();
  });

  it("does not accept tenantId from the input payload", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.create).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    // Even if someone passes tenantId in the input, it must be ignored
    const inputWithTenantId = {
      ...validInput,
      tenantId: "attacker-tenant",
    } as unknown as typeof validInput;

    await createWrap(inputWithTenantId);

    expect(prisma.wrap.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });
});
