import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoist mock variables so they're available inside vi.mock() factories ──────

const mockSessionsCreate = vi.hoisted(() => vi.fn());
const mockInvoicesRetrieve = vi.hoisted(() => vi.fn());
const mockPaymentIntentsRetrieve = vi.hoisted(() => vi.fn());
const mockConstructEvent = vi.hoisted(() => vi.fn());

// Hoist the StripeError class so we can instantiate it in test bodies
const MockStripeError = vi.hoisted(() => {
  class StripeError extends Error {
    type: string;
    constructor(message: string) {
      super(message);
      this.type = "StripeError";
      this.name = "StripeError";
    }
  }
  return StripeError;
});

// Mock Stripe constructor and methods before importing the module under test
vi.mock("stripe", () => {
  const MockStripeClass = function (this: object) {
    Object.assign(this, {
      checkout: {
        sessions: { create: mockSessionsCreate },
      },
      invoices: { retrieve: mockInvoicesRetrieve },
      paymentIntents: { retrieve: mockPaymentIntentsRetrieve },
      webhooks: { constructEvent: mockConstructEvent },
    });
  } as unknown;

  // Expose StripeError so instanceof checks work in the wrapper
  (MockStripeClass as unknown as Record<string, unknown>).errors = {
    StripeError: MockStripeError,
  };

  return { default: MockStripeClass };
});

// ── Import module under test (after mocks) ────────────────────────────────────

import {
  createCheckoutSession,
  getInvoice,
  getPaymentStatus,
  constructWebhookEvent,
} from "../stripe";

// ── Helpers ───────────────────────────────────────────────────────────────────

const validCheckoutInput = {
  invoiceId: "inv-1",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  customerEmail: "customer@example.com",
};

const mockStripeSession = {
  id: "cs_test_123",
  url: "https://checkout.stripe.com/pay/cs_test_123",
  payment_intent: "pi_test_456",
  status: "open",
  metadata: { invoiceId: "inv-1" },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  });

  it("returns a CheckoutSessionDTO on success", async () => {
    mockSessionsCreate.mockResolvedValue(mockStripeSession);

    const result = await createCheckoutSession(validCheckoutInput, [
      {
        price_data: { currency: "usd", unit_amount: 5000, product_data: { name: "Wrap" } },
        quantity: 1,
      },
    ]);

    expect(result).toEqual({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
      invoiceId: "inv-1",
      stripePaymentIntentId: "pi_test_456",
      status: "open",
    });
  });

  it("passes customer email when provided", async () => {
    mockSessionsCreate.mockResolvedValue(mockStripeSession);

    await createCheckoutSession(validCheckoutInput, []);

    expect(mockSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "customer@example.com",
        metadata: { invoiceId: "inv-1" },
      }),
    );
  });

  it("omits customer_email when not provided", async () => {
    mockSessionsCreate.mockResolvedValue(mockStripeSession);

    const inputWithoutEmail = {
      invoiceId: "inv-1",
      successUrl: "https://example.com/success",
      cancelUrl: "https://example.com/cancel",
    };

    await createCheckoutSession(inputWithoutEmail, []);

    const callArgs = mockSessionsCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs).not.toHaveProperty("customer_email");
  });

  it("throws if Stripe returns no URL", async () => {
    mockSessionsCreate.mockResolvedValue({ ...mockStripeSession, url: null });

    await expect(createCheckoutSession(validCheckoutInput, [])).rejects.toThrow(
      "Stripe did not return a checkout URL.",
    );
  });

  it("wraps Stripe errors with a descriptive message", async () => {
    const stripeErr = new MockStripeError("card_declined");
    mockSessionsCreate.mockRejectedValue(stripeErr);

    await expect(createCheckoutSession(validCheckoutInput, [])).rejects.toThrow(
      "Stripe checkout session creation failed: card_declined",
    );
  });

  it("throws if STRIPE_SECRET_KEY is not set on first initialization", async () => {
    // Reset modules so the Stripe client singleton is cleared
    vi.resetModules();
    delete process.env.STRIPE_SECRET_KEY;

    // Re-import after resetting modules so we get a fresh, uncached client
    const { createCheckoutSession: freshCreate } = await import("../stripe");

    await expect(freshCreate(validCheckoutInput, [])).rejects.toThrow(
      "STRIPE_SECRET_KEY is not defined",
    );

    // Restore env for subsequent tests
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  });
});

describe("getInvoice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  });

  it("returns the Stripe invoice on success", async () => {
    const mockInvoice = { id: "in_test_789", status: "paid", amount_due: 10000 };
    mockInvoicesRetrieve.mockResolvedValue(mockInvoice);

    const result = await getInvoice("in_test_789");

    expect(mockInvoicesRetrieve).toHaveBeenCalledWith("in_test_789");
    expect(result).toEqual(mockInvoice);
  });

  it("wraps Stripe errors with a descriptive message", async () => {
    const stripeErr = new MockStripeError("No such invoice");
    mockInvoicesRetrieve.mockRejectedValue(stripeErr);

    await expect(getInvoice("in_bad")).rejects.toThrow(
      "Stripe invoice retrieval failed: No such invoice",
    );
  });
});

describe("getPaymentStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  });

  it("returns 'succeeded' when PaymentIntent status is succeeded", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({ id: "pi_1", status: "succeeded" });

    const result = await getPaymentStatus("pi_1");

    expect(result).toBe("succeeded");
  });

  it("returns 'failed' when PaymentIntent status is canceled", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({ id: "pi_1", status: "canceled" });

    const result = await getPaymentStatus("pi_1");

    expect(result).toBe("failed");
  });

  it("returns 'failed' when PaymentIntent status is requires_payment_method", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({ id: "pi_1", status: "requires_payment_method" });

    const result = await getPaymentStatus("pi_1");

    expect(result).toBe("failed");
  });

  it("returns 'pending' for processing status", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({ id: "pi_1", status: "processing" });

    const result = await getPaymentStatus("pi_1");

    expect(result).toBe("pending");
  });

  it("returns 'pending' for requires_action status", async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({ id: "pi_1", status: "requires_action" });

    const result = await getPaymentStatus("pi_1");

    expect(result).toBe("pending");
  });

  it("wraps Stripe errors with a descriptive message", async () => {
    const stripeErr = new MockStripeError("No such payment_intent");
    mockPaymentIntentsRetrieve.mockRejectedValue(stripeErr);

    await expect(getPaymentStatus("pi_bad")).rejects.toThrow(
      "Stripe payment status retrieval failed: No such payment_intent",
    );
  });
});

describe("constructWebhookEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  });

  it("returns the Stripe event on valid signature", () => {
    const mockEvent = { id: "evt_1", type: "checkout.session.completed", data: {} };
    mockConstructEvent.mockReturnValue(mockEvent);

    const result = constructWebhookEvent('{"id":"evt_1"}', "t=123,v1=abc", "whsec_test");

    expect(mockConstructEvent).toHaveBeenCalledWith('{"id":"evt_1"}', "t=123,v1=abc", "whsec_test");
    expect(result).toEqual(mockEvent);
  });

  it("wraps Stripe errors with a descriptive message", () => {
    const stripeErr = new MockStripeError("No signatures found matching the expected signature");
    mockConstructEvent.mockImplementation(() => {
      throw stripeErr;
    });

    expect(() => constructWebhookEvent("payload", "bad-sig", "whsec_test")).toThrow(
      "Stripe webhook verification failed: No signatures found matching the expected signature",
    );
  });
});
