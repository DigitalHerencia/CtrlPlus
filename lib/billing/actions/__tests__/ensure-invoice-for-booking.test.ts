import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  assertTenantMembership: vi.fn(),
  findBooking: vi.fn(),
  transaction: vi.fn(),
  createInvoice: vi.fn(),
  createAuditLog: vi.fn(),
  findInvoiceByBooking: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  getSession: mocks.getSession,
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mocks.assertTenantMembership,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findFirst: mocks.findBooking,
    },
    invoice: {
      findUnique: mocks.findInvoiceByBooking,
    },
    auditLog: {
      create: mocks.createAuditLog,
    },
    $transaction: mocks.transaction,
  },
}));

import { ensureInvoiceForBooking } from "../ensure-invoice-for-booking";

describe("ensureInvoiceForBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getSession.mockResolvedValue({ tenantId: "tenant-1", userId: "user-1" });
    mocks.assertTenantMembership.mockResolvedValue(undefined);
    mocks.findBooking.mockResolvedValue({
      id: "booking-1",
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      totalPrice: 12000,
      invoice: null,
      wrap: { name: "Premium Wrap" },
    });

    mocks.createInvoice.mockResolvedValue({ id: "inv-1" });
    mocks.createAuditLog.mockResolvedValue(undefined);
    mocks.transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        invoice: { create: mocks.createInvoice },
        auditLog: { create: mocks.createAuditLog },
      }),
    );
  });

  it("creates invoice exactly once and returns existing invoice on race", async () => {
    mocks.transaction
      .mockRejectedValueOnce({ code: "P2002" })
      .mockImplementationOnce(async (callback: (tx: unknown) => Promise<unknown>) =>
        callback({
          invoice: { create: mocks.createInvoice },
          auditLog: { create: mocks.createAuditLog },
        }),
      );

    mocks.findInvoiceByBooking.mockResolvedValue({ id: "inv-existing" });

    const first = await ensureInvoiceForBooking({ bookingId: "booking-1" });
    const second = await ensureInvoiceForBooking({ bookingId: "booking-1" });

    expect(first).toEqual({ invoiceId: "inv-existing", created: false });
    expect(second).toEqual({ invoiceId: "inv-1", created: true });
  });

  it("returns existing invoice when booking already has one", async () => {
    mocks.findBooking.mockResolvedValue({
      id: "booking-1",
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      totalPrice: 12000,
      invoice: { id: "inv-existing" },
      wrap: { name: "Premium Wrap" },
    });

    const result = await ensureInvoiceForBooking({ bookingId: "booking-1" });

    expect(result).toEqual({ invoiceId: "inv-existing", created: false });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("enforces tenant and customer scope", async () => {
    await ensureInvoiceForBooking({ bookingId: "booking-1" });

    expect(mocks.findBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "booking-1",
          tenantId: "tenant-1",
          customerId: "user-1",
          deletedAt: null,
        }),
      }),
    );
  });
});
