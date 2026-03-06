import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mock variables ────────────────────────────────────────────────────

const mockCheckoutSessionsCreate = vi.hoisted(() => vi.fn());

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
  assertTenantScope: vi.fn(),
  getUserTenantRole: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findFirst: vi.fn(),
    },
    invoice: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/billing/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: mockCheckoutSessionsCreate,
      },
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership, assertTenantScope, getUserTenantRole } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "../create-checkout-session";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  user: { id: "user-1", clerkUserId: "clerk-1", email: "member@example.com" },
  tenantId: "tenant-1",
};

const validInput = {
  bookingId: "booking-1",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
};

const mockBooking = {
  id: "booking-1",
  tenantId: "tenant-1",
  customerId: "user-1",
  status: "pending",
  totalPrice: 150000, // $1500 in cents
  wrap: { name: "Carbon Fiber Full Wrap" },
};

const mockInvoice = {
  id: "invoice-1",
  tenantId: "tenant-1",
  bookingId: "booking-1",
  status: "draft",
  totalAmount: 150000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockStripeSession = {
  id: "cs_test_123",
  url: "https://checkout.stripe.com/pay/cs_test_123",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: treat the user as a member who owns the booking
    vi.mocked(getUserTenantRole).mockResolvedValue("member");
  });

  it("creates a checkout session and returns URL + invoiceId when authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.invoice.create).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    const result = await createCheckoutSession(validInput);

    expect(result).toEqual({
      checkoutUrl: "https://checkout.stripe.com/pay/cs_test_123",
      invoiceId: "invoice-1",
    });
  });

  it("scopes booking lookup to the current tenantId", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession(validInput);

    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "booking-1",
          tenantId: "tenant-1",
          deletedAt: null,
        }),
      }),
    );
  });

  it("reuses an existing invoice when one exists for the booking", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession(validInput);

    expect(prisma.invoice.create).not.toHaveBeenCalled();
    expect(prisma.invoice.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "invoice-1" },
        data: { status: "sent" },
      }),
    );
  });

  it("creates a new invoice when none exists for the booking", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.invoice.create).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession(validInput);

    expect(prisma.invoice.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          bookingId: "booking-1",
          status: "draft",
          totalAmount: 150000,
        }),
      }),
    );
  });

  it("passes client_reference_id = invoiceId to Stripe", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession(validInput);

    expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        client_reference_id: "invoice-1",
        success_url: validInput.successUrl,
        cancel_url: validInput.cancelUrl,
      }),
    );
  });

  it("writes an audit log entry after creating the session", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession(validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "user-1",
          action: "CREATE_CHECKOUT_SESSION",
          resourceType: "Invoice",
          resourceId: "invoice-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: null, tenantId: "" });

    await expect(createCheckoutSession(validInput)).rejects.toThrow(
      "Unauthorized",
    );
    expect(prisma.booking.findFirst).not.toHaveBeenCalled();
  });

  it("throws when assertTenantMembership rejects (Forbidden)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership"),
    );

    await expect(createCheckoutSession(validInput)).rejects.toThrow("Forbidden");
    expect(prisma.booking.findFirst).not.toHaveBeenCalled();
  });

  it("throws when the booking is not found", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(null);

    await expect(createCheckoutSession(validInput)).rejects.toThrow(
      "Booking not found or access denied",
    );
    expect(prisma.invoice.findUnique).not.toHaveBeenCalled();
  });

  it("throws when the booking status is not 'pending'", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue({
      ...mockBooking,
      status: "confirmed",
    } as never);

    await expect(createCheckoutSession(validInput)).rejects.toThrow(
      "Cannot create checkout for booking with status: confirmed",
    );
    expect(prisma.invoice.findUnique).not.toHaveBeenCalled();
  });

  it("throws when Stripe does not return a URL", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    mockCheckoutSessionsCreate.mockResolvedValue({ id: "cs_test_no_url", url: null });

    await expect(createCheckoutSession(validInput)).rejects.toThrow(
      "Stripe did not return a checkout URL",
    );
  });

  it("rejects invalid input — missing bookingId", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = {
      bookingId: "",
      successUrl: "https://example.com/success",
      cancelUrl: "https://example.com/cancel",
    };

    await expect(createCheckoutSession(badInput)).rejects.toThrow();
    expect(prisma.booking.findFirst).not.toHaveBeenCalled();
  });

  it("rejects invalid input — invalid successUrl", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = {
      bookingId: "booking-1",
      successUrl: "not-a-url",
      cancelUrl: "https://example.com/cancel",
    };

    await expect(createCheckoutSession(badInput)).rejects.toThrow();
    expect(prisma.booking.findFirst).not.toHaveBeenCalled();
  });

  it("does not accept tenantId from the input payload", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(mockBooking as never);
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    // Even if an attacker injects a tenantId, the session tenantId must be used
    const inputWithInjectedTenantId = {
      ...validInput,
      tenantId: "attacker-tenant",
    } as unknown as typeof validInput;

    await createCheckoutSession(inputWithInjectedTenantId);

    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });

  it("throws Forbidden when a member tries to checkout another user's booking", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    // Booking belongs to a different customer
    vi.mocked(prisma.booking.findFirst).mockResolvedValue({
      ...mockBooking,
      customerId: "other-user",
    } as never);
    vi.mocked(getUserTenantRole).mockResolvedValue("member");

    await expect(createCheckoutSession(validInput)).rejects.toThrow(
      "Forbidden: you can only checkout your own bookings",
    );
    expect(prisma.invoice.findUnique).not.toHaveBeenCalled();
  });

  it("allows an admin to checkout any booking in the tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(assertTenantScope).mockReturnValue(undefined);
    // Booking belongs to a different customer, but user is an admin
    vi.mocked(prisma.booking.findFirst).mockResolvedValue({
      ...mockBooking,
      customerId: "other-user",
    } as never);
    vi.mocked(getUserTenantRole).mockResolvedValue("admin");
    vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice as never);
    vi.mocked(prisma.invoice.update).mockResolvedValue({
      ...mockInvoice,
      status: "sent",
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    mockCheckoutSessionsCreate.mockResolvedValue(mockStripeSession);

    const result = await createCheckoutSession(validInput);
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/pay/cs_test_123");
  });
});
