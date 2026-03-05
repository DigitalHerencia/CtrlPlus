import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTenantStats } from "../get-tenant-stats";

const {
  wrapCountMock,
  bookingCountMock,
  invoiceAggregateMock,
  membershipCountMock,
} = vi.hoisted(() => ({
  wrapCountMock: vi.fn(),
  bookingCountMock: vi.fn(),
  invoiceAggregateMock: vi.fn(),
  membershipCountMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: { count: wrapCountMock },
    booking: { count: bookingCountMock },
    invoice: { aggregate: invoiceAggregateMock },
    tenantUserMembership: { count: membershipCountMock },
  },
}));

describe("getTenantStats", () => {
  const tenantId = "tenant-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correctly mapped stats DTO", async () => {
    wrapCountMock.mockResolvedValue(10);
    bookingCountMock
      .mockResolvedValueOnce(25) // totalBookings
      .mockResolvedValueOnce(3); // pendingBookings
    invoiceAggregateMock.mockResolvedValue({
      _sum: { amountCents: 150000 },
    });
    membershipCountMock.mockResolvedValue(4);

    const stats = await getTenantStats(tenantId);

    expect(stats).toEqual({
      totalWraps: 10,
      totalBookings: 25,
      pendingBookings: 3,
      totalRevenue: 1500,
      totalMembers: 4,
    });
  });

  it("handles null revenue gracefully", async () => {
    wrapCountMock.mockResolvedValue(0);
    bookingCountMock.mockResolvedValue(0);
    invoiceAggregateMock.mockResolvedValue({
      _sum: { amountCents: null },
    });
    membershipCountMock.mockResolvedValue(0);

    const stats = await getTenantStats(tenantId);

    expect(stats.totalRevenue).toBe(0);
  });

  it("queries wrap with correct tenant scope and soft-delete filter", async () => {
    wrapCountMock.mockResolvedValue(5);
    bookingCountMock.mockResolvedValue(0);
    invoiceAggregateMock.mockResolvedValue({
      _sum: { amountCents: 0 },
    });
    membershipCountMock.mockResolvedValue(1);

    await getTenantStats(tenantId);

    expect(wrapCountMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId, deletedAt: null }),
      })
    );
  });

  it("queries bookings with correct tenant scope", async () => {
    wrapCountMock.mockResolvedValue(0);
    bookingCountMock.mockResolvedValue(2);
    invoiceAggregateMock.mockResolvedValue({
      _sum: { amountCents: 0 },
    });
    membershipCountMock.mockResolvedValue(1);

    await getTenantStats(tenantId);

    expect(bookingCountMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ tenantId }) })
    );
  });
});
