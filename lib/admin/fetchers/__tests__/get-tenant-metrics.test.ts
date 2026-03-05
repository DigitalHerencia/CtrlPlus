import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  BookingStatus,
  InvoiceStatus,
  MembershipStatus,
  TenantRole,
  WrapStatus,
} from "@prisma/client";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: {
      findFirst: vi.fn(),
      count: vi.fn(),
    },
    wrap: {
      count: vi.fn(),
    },
    booking: {
      count: vi.fn(),
    },
    invoice: {
      aggregate: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getTenantMetrics } from "../get-tenant-metrics";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TENANT_ID = "tenant-1";
const ADMIN_USER_ID = "user_admin123";
const MEMBER_USER_ID = "user_member456";

const ADMIN_MEMBERSHIP = { role: TenantRole.ADMIN };
const OWNER_MEMBERSHIP = { role: TenantRole.OWNER };
const MEMBER_MEMBERSHIP = { role: TenantRole.MEMBER };

function setupFullMetricsMocks() {
  vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
    ADMIN_MEMBERSHIP as never
  );
  vi.mocked(prisma.wrap.count).mockResolvedValue(5);
  // Order matches the Promise.all array in getTenantMetrics:
  // total, pending, confirmed, completed, cancelled
  vi.mocked(prisma.booking.count)
    .mockResolvedValueOnce(10)
    .mockResolvedValueOnce(3)
    .mockResolvedValueOnce(4)
    .mockResolvedValueOnce(2)
    .mockResolvedValueOnce(1);
  vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(8);
  vi.mocked(prisma.invoice.aggregate).mockResolvedValue({
    _sum: { amount: 5000 as never },
  } as never);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("getTenantMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── RBAC checks ────────────────────────────────────────────────────────────

  it("throws Forbidden when user is not a member of the tenant", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(null);

    await expect(getTenantMetrics(TENANT_ID, ADMIN_USER_ID)).rejects.toThrow(
      "Forbidden"
    );
  });

  it("throws Forbidden when user has MEMBER role", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      MEMBER_MEMBERSHIP as never
    );

    await expect(getTenantMetrics(TENANT_ID, MEMBER_USER_ID)).rejects.toThrow(
      "Forbidden"
    );
  });

  it("permits access for ADMIN role", async () => {
    setupFullMetricsMocks();

    await expect(
      getTenantMetrics(TENANT_ID, ADMIN_USER_ID)
    ).resolves.toBeDefined();
  });

  it("permits access for OWNER role", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      OWNER_MEMBERSHIP as never
    );
    vi.mocked(prisma.wrap.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);
    vi.mocked(prisma.invoice.aggregate).mockResolvedValue({
      _sum: { amount: null },
    } as never);

    await expect(
      getTenantMetrics(TENANT_ID, ADMIN_USER_ID)
    ).resolves.toBeDefined();
  });

  // ── RBAC query scoping ─────────────────────────────────────────────────────

  it("checks RBAC using tenantId and clerkUserId relational filter", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(null);

    await expect(getTenantMetrics(TENANT_ID, ADMIN_USER_ID)).rejects.toThrow();

    expect(prisma.tenantUserMembership.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: TENANT_ID,
          user: { clerkUserId: ADMIN_USER_ID },
          status: MembershipStatus.ACTIVE,
        }),
      })
    );
  });

  // ── Metrics accuracy ───────────────────────────────────────────────────────

  it("returns correct aggregated metrics", async () => {
    setupFullMetricsMocks();

    const result = await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    expect(result.totalWraps).toBe(5);
    expect(result.totalBookings).toBe(10);
    expect(result.pendingBookings).toBe(3);
    expect(result.confirmedBookings).toBe(4);
    expect(result.completedBookings).toBe(2);
    expect(result.cancelledBookings).toBe(1);
    expect(result.totalActiveMembers).toBe(8);
    expect(result.totalRevenue).toBe(5000);
  });

  it("returns zero revenue when no paid invoices exist", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.wrap.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);
    vi.mocked(prisma.invoice.aggregate).mockResolvedValue({
      _sum: { amount: null },
    } as never);

    const result = await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    expect(result.totalRevenue).toBe(0);
  });

  // ── Tenant scoping ─────────────────────────────────────────────────────────

  it("scopes wrap count by tenantId and ACTIVE status", async () => {
    setupFullMetricsMocks();

    await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    expect(prisma.wrap.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: TENANT_ID,
          status: WrapStatus.ACTIVE,
        }),
      })
    );
  });

  it("scopes booking counts by tenantId and excludes soft-deleted records", async () => {
    setupFullMetricsMocks();

    await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    // All booking count calls should include tenantId and deletedAt: null
    const bookingCountCalls = vi.mocked(prisma.booking.count).mock.calls;
    expect(bookingCountCalls.length).toBeGreaterThanOrEqual(5);
    for (const [args] of bookingCountCalls) {
      expect(args?.where).toMatchObject({
        tenantId: TENANT_ID,
        deletedAt: null,
      });
    }
  });

  it("scopes member count by tenantId and ACTIVE status", async () => {
    setupFullMetricsMocks();

    await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    expect(prisma.tenantUserMembership.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: TENANT_ID,
          status: MembershipStatus.ACTIVE,
        }),
      })
    );
  });

  it("scopes revenue aggregate by tenantId and PAID status", async () => {
    setupFullMetricsMocks();

    await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    expect(prisma.invoice.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: TENANT_ID,
          status: InvoiceStatus.PAID,
        }),
      })
    );
  });

  it("counts each booking status separately", async () => {
    setupFullMetricsMocks();

    await getTenantMetrics(TENANT_ID, ADMIN_USER_ID);

    const bookingCountCalls = vi.mocked(prisma.booking.count).mock.calls;
    const statuses = bookingCountCalls
      .map(([args]) => args?.where?.status)
      .filter(Boolean);

    expect(statuses).toContain(BookingStatus.PENDING);
    expect(statuses).toContain(BookingStatus.CONFIRMED);
    expect(statuses).toContain(BookingStatus.COMPLETED);
    expect(statuses).toContain(BookingStatus.CANCELLED);
  });
});
