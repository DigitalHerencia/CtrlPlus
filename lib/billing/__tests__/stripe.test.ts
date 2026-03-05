import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Minimal Stripe StripeError shape for mocking. */
function makeStripeError(message: string, code: string, statusCode: number, type = "card_error") {
  const err = new Error(message) as Error & {
    type: string;
    code: string;
    statusCode: number;
  };
  err.name = "StripeCardError";
  err.type = type;
  err.code = code;
  err.statusCode = statusCode;
  return err;
}

// ── Stripe SDK mock ───────────────────────────────────────────────────────────
// Use vi.hoisted() so these variables are available inside the vi.mock() factory,
// which is hoisted to run before all other module-level code.

const { mockCreate, mockRetrieveSession, mockRetrievePaymentIntent, mockConstructEvent } =
  vi.hoisted(() => ({
    mockCreate: vi.fn(),
    mockRetrieveSession: vi.fn(),
    mockRetrievePaymentIntent: vi.fn(),
    mockConstructEvent: vi.fn(),
  }));

vi.mock("stripe", () => {
  class MockStripeErrors {
    static StripeError = class extends Error {
      type: string;
      code?: string;
      statusCode?: number;
      constructor(
        message: string,
        { type, code, statusCode }: { type: string; code?: string; statusCode?: number },
      ) {
        super(message);
        this.name = "StripeError";
        this.type = type;
        this.code = code;
        this.statusCode = statusCode;
      }
    };
  }

  // Use a regular (non-arrow) function so it can be called with `new`
  function MockStripe() {
    return {
      checkout: {
        sessions: {
          create: mockCreate,
          retrieve: mockRetrieveSession,
        },
      },
      paymentIntents: {
        retrieve: mockRetrievePaymentIntent,
      },
      webhooks: {
        constructEvent: mockConstructEvent,
      },
    };
  }
  vi.fn().mockImplementation(MockStripe);

  (MockStripe as unknown as { errors: typeof MockStripeErrors }).errors = MockStripeErrors;

  return { default: MockStripe };
});

// ── Subject under test ────────────────────────────────────────────────────────

import {
  BillingError,
  createCheckoutSession,
  retrieveCheckoutSession,
  retrievePaymentIntent,
  constructWebhookEvent,
} from "../stripe";

// ── Tests ─────────────────────────────────────────────────────────────────────

const FAKE_SESSION = {
  id: "cs_test_abc",
  url: "https://checkout.stripe.com/pay/cs_test_abc",
  status: "open",
  payment_status: "unpaid",
  amount_total: 80000,
  currency: "usd",
};

const FAKE_PAYMENT_INTENT = {
  id: "pi_test_abc",
  status: "succeeded",
  amount: 80000,
  currency: "usd",
};

const FAKE_EVENT: object = {
  id: "evt_test_abc",
  type: "checkout.session.completed",
  data: { object: FAKE_SESSION },
};

describe("BillingError", () => {
  it("sets name, message, code, and statusCode", () => {
    const err = new BillingError("card declined", "card_declined", 402);
    expect(err.name).toBe("BillingError");
    expect(err.message).toBe("card declined");
    expect(err.code).toBe("card_declined");
    expect(err.statusCode).toBe(402);
  });

  it("defaults statusCode to 500", () => {
    const err = new BillingError("oops", "unknown_error");
    expect(err.statusCode).toBe(500);
  });
});

describe("createCheckoutSession", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  });

  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.clearAllMocks();
  });

  it("returns the Stripe session on success", async () => {
    mockCreate.mockResolvedValueOnce(FAKE_SESSION);

    const session = await createCheckoutSession({
      mode: "payment",
      line_items: [],
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    expect(session.id).toBe("cs_test_abc");
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("wraps Stripe errors in BillingError", async () => {
    mockCreate.mockRejectedValueOnce(
      makeStripeError("Your card was declined", "card_declined", 402),
    );

    await expect(
      createCheckoutSession({
        mode: "payment",
        line_items: [],
        success_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      }),
    ).rejects.toBeInstanceOf(BillingError);
  });
});

describe("retrieveCheckoutSession", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  });
  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.clearAllMocks();
  });

  it("returns the Stripe session on success", async () => {
    mockRetrieveSession.mockResolvedValueOnce(FAKE_SESSION);

    const session = await retrieveCheckoutSession("cs_test_abc");
    expect(session.id).toBe("cs_test_abc");
  });

  it("throws BillingError when session not found", async () => {
    mockRetrieveSession.mockRejectedValueOnce(
      makeStripeError("No such checkout.session", "resource_missing", 404, "invalid_request_error"),
    );

    await expect(retrieveCheckoutSession("cs_bad")).rejects.toBeInstanceOf(BillingError);
  });
});

describe("retrievePaymentIntent", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  });
  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.clearAllMocks();
  });

  it("returns the payment intent on success", async () => {
    mockRetrievePaymentIntent.mockResolvedValueOnce(FAKE_PAYMENT_INTENT);

    const pi = await retrievePaymentIntent("pi_test_abc");
    expect(pi.id).toBe("pi_test_abc");
    expect(pi.status).toBe("succeeded");
  });

  it("throws BillingError on failure", async () => {
    mockRetrievePaymentIntent.mockRejectedValueOnce(
      makeStripeError("No such payment_intent", "resource_missing", 404),
    );

    await expect(retrievePaymentIntent("pi_bad")).rejects.toBeInstanceOf(BillingError);
  });
});

describe("constructWebhookEvent", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  });
  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.clearAllMocks();
  });

  it("returns the verified event on success", () => {
    mockConstructEvent.mockReturnValueOnce(FAKE_EVENT);

    const event = constructWebhookEvent(Buffer.from("payload"), "t=123,v1=abc", "whsec_test");

    expect((event as typeof FAKE_EVENT & { id: string }).id).toBe("evt_test_abc");
    expect(mockConstructEvent).toHaveBeenCalledWith(
      expect.anything(),
      "t=123,v1=abc",
      "whsec_test",
    );
  });

  it("throws BillingError when signature is invalid", () => {
    mockConstructEvent.mockImplementationOnce(() => {
      throw makeStripeError(
        "No signatures found matching the expected signature for payload",
        "webhook_signature_verification_failed",
        400,
        "StripeSignatureVerificationError",
      );
    });

    expect(() => constructWebhookEvent(Buffer.from("tampered"), "bad-sig", "whsec_test")).toThrow(
      BillingError,
    );
  });
});
