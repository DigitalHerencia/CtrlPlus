import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrap } from "../create-wrap";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  requireAuth: vi.fn(),
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

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
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
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
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
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
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

  it("writes an audit log after creating the wrap", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.create).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await createWrap(validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "wrap.created",
          tenantId: "tenant-1",
          userId: "user-1",
          resourceType: "Wrap",
          resourceId: "wrap-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new Error("Unauthorized: not authenticated"));

    await expect(createWrap(validInput)).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(createWrap(validInput)).rejects.toThrow("Forbidden");
  });

  it("always uses tenantId from the session, never from user-supplied input", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.create).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    // Even if a caller tried to embed a tenantId in the input, the action must
    // ignore it and only use the server-side session value.
    const inputWithInjectedTenantId = { ...validInput, tenantId: "attacker-tenant" };
    await createWrap(inputWithInjectedTenantId);

    expect(prisma.wrap.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
    // The injected tenantId must NOT appear in the DB write
    expect(prisma.wrap.create).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "attacker-tenant" }),
      }),
    );
  });

  it("throws a ZodError for invalid input (missing name)", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { ...validInput, name: "" };

    await expect(createWrap(badInput)).rejects.toThrow();
    expect(prisma.wrap.create).not.toHaveBeenCalled();
  });

  it("throws a ZodError for invalid input (negative price)", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { ...validInput, price: -50 };

    await expect(createWrap(badInput)).rejects.toThrow();
    expect(prisma.wrap.create).not.toHaveBeenCalled();
  });

  it("does not accept tenantId from the input payload", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
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
