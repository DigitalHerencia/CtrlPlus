import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  handleStripeEvent: vi.fn(),
}));

vi.mock("@/lib/billing/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: mocks.constructEvent,
    },
  },
}));

vi.mock("@/lib/billing/actions/handle-stripe-event", () => ({
  handleStripeEvent: mocks.handleStripeEvent,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WEBHOOK_SECRET = "whsec_test_secret";

function makeRequest(
  body: string,
  signature: string | null = "t=123,v1=abc"
): NextRequest {
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    body,
    headers: {
      "content-type": "application/json",
      ...(signature !== null ? { "stripe-signature": signature } : {}),
    },
  });
}

const fakeEvent = {
  id: "evt_test_001",
  type: "checkout.session.completed",
  object: "event",
  data: { object: {} },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", WEBHOOK_SECRET);
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder");
  });

  describe("missing environment configuration", () => {
    it("returns 500 when STRIPE_WEBHOOK_SECRET is not set", async () => {
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");

      const req = makeRequest(JSON.stringify({}));
      const res = await POST(req);

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toMatch(/webhook secret/i);
    });
  });

  describe("signature validation", () => {
    it("returns 400 when stripe-signature header is missing", async () => {
      const req = makeRequest(JSON.stringify({}), null);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toMatch(/stripe-signature/i);
    });

    it("returns 400 when signature verification fails", async () => {
      mocks.constructEvent.mockImplementation(() => {
        throw new Error("No signatures found matching the expected signature");
      });

      const req = makeRequest(JSON.stringify({}));
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("No signatures found");
    });

    it("calls constructEvent with raw body and signature", async () => {
      const rawBody = JSON.stringify({ id: "evt_test" });
      mocks.constructEvent.mockReturnValue(fakeEvent);
      mocks.handleStripeEvent.mockResolvedValue(undefined);

      const req = makeRequest(rawBody, "t=1,v1=sig");
      await POST(req);

      expect(mocks.constructEvent).toHaveBeenCalledWith(
        rawBody,
        "t=1,v1=sig",
        WEBHOOK_SECRET
      );
    });
  });

  describe("successful processing", () => {
    it("returns 200 with { received: true } on success", async () => {
      mocks.constructEvent.mockReturnValue(fakeEvent);
      mocks.handleStripeEvent.mockResolvedValue(undefined);

      const req = makeRequest(JSON.stringify(fakeEvent));
      const res = await POST(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ received: true });
    });

    it("calls handleStripeEvent with the parsed event", async () => {
      mocks.constructEvent.mockReturnValue(fakeEvent);
      mocks.handleStripeEvent.mockResolvedValue(undefined);

      const req = makeRequest(JSON.stringify(fakeEvent));
      await POST(req);

      expect(mocks.handleStripeEvent).toHaveBeenCalledWith(fakeEvent);
    });
  });

  describe("handler errors", () => {
    it("returns 500 when handleStripeEvent throws", async () => {
      mocks.constructEvent.mockReturnValue(fakeEvent);
      mocks.handleStripeEvent.mockRejectedValue(new Error("DB unavailable"));

      const req = makeRequest(JSON.stringify(fakeEvent));
      const res = await POST(req);

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toMatch(/internal processing error/i);
    });
  });
});
