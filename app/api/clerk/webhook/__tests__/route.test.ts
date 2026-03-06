import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Hoisted mock variables ────────────────────────────────────────────────────

const mockVerify = vi.hoisted(() => vi.fn());
const mockWebhookCtor = vi.hoisted(() => vi.fn(() => ({ verify: mockVerify })));

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("svix", () => ({
  Webhook: mockWebhookCtor,
}));

vi.mock("@/lib/prisma", () => {
  const mockTx = {
    clerkWebhookEvent: { create: vi.fn() },
    user: { upsert: vi.fn(), updateMany: vi.fn() },
    tenantUserMembership: { updateMany: vi.fn() },
  };

  return {
    prisma: {
      clerkWebhookEvent: { findUnique: vi.fn() },
      $transaction: vi.fn(async (fn: (tx: typeof mockTx) => Promise<unknown>) => fn(mockTx)),
      _mockTx: mockTx,
    },
  };
});

// ── Imports after mocks ───────────────────────────────────────────────────────

import { POST } from "../route";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Access the internal transaction mock
const mockTx = (
  prisma as unknown as { _mockTx: Record<string, Record<string, ReturnType<typeof vi.fn>>> }
)._mockTx;

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_SVIX_HEADERS = {
  "svix-id": "evt_001",
  "svix-timestamp": "1234567890",
  "svix-signature": "v1,abc123",
};

function makeRequest(body: object, headers: Record<string, string> = VALID_SVIX_HEADERS) {
  const bodyStr = JSON.stringify(body);
  return new NextRequest("http://localhost/api/clerk/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: bodyStr,
  });
}

function mockEvent(type: string, data: object) {
  return { type, data };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/clerk/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_WEBHOOK_SECRET = "whsec_test_secret";
    vi.mocked(prisma.clerkWebhookEvent.findUnique).mockResolvedValue(null);
    mockVerify.mockReturnValue(mockEvent("user.created", {}));
  });

  // ── Signature verification ────────────────────────────────────────────────

  it("returns 401 when Svix headers are missing", async () => {
    const req = makeRequest({}, {});
    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/missing/i);
  });

  it("returns 401 when svix-id header is absent", async () => {
    const req = makeRequest({}, { "svix-timestamp": "123", "svix-signature": "v1,abc" });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 when Svix signature verification throws", async () => {
    mockVerify.mockImplementationOnce(() => {
      throw new Error("Invalid signature");
    });
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/invalid signature/i);
  });

  it("returns 401 when CLERK_WEBHOOK_SECRET is not set", async () => {
    delete process.env.CLERK_WEBHOOK_SECRET;
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  // ── Idempotency ───────────────────────────────────────────────────────────

  it("returns 200 with skipped:true for a duplicate event (pre-check)", async () => {
    vi.mocked(prisma.clerkWebhookEvent.findUnique).mockResolvedValue({
      id: "evt_001",
      type: "user.created",
      processedAt: new Date(),
    });

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.skipped).toBe(true);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("returns 200 when a concurrent delivery triggers a P2002 on clerkWebhookEvent.create", async () => {
    // Simulate race: findUnique returns null (both requests pass the pre-check),
    // but the second request hits a unique-constraint violation on insert.
    const p2002 = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed on the fields: (`id`)",
      { code: "P2002", clientVersion: "7.0.0" },
    );
    mockTx.clerkWebhookEvent.create.mockRejectedValueOnce(p2002);

    const evt = mockEvent("user.created", {
      id: "clerk_user_race",
      email_addresses: [{ id: "ema_1", email_address: "race@example.com" }],
      primary_email_address_id: "ema_1",
      first_name: null,
      last_name: null,
      image_url: null,
    });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    const res = await POST(req);
    // Should not blow up with 500; the duplicate is silently absorbed.
    expect(res.status).toBe(200);
    // User upsert was not executed after the early return inside the transaction.
    expect(mockTx.user.upsert).not.toHaveBeenCalled();
  });

  // ── user.created ─────────────────────────────────────────────────────────

  it("upserts User on user.created", async () => {
    const evt = mockEvent("user.created", {
      id: "clerk_user_1",
      email_addresses: [{ id: "ema_1", email_address: "alice@example.com" }],
      primary_email_address_id: "ema_1",
      first_name: "Alice",
      last_name: "Smith",
      image_url: "https://example.com/avatar.jpg",
    });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(mockTx.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkUserId: "clerk_user_1" },
        create: expect.objectContaining({
          clerkUserId: "clerk_user_1",
          email: "alice@example.com",
          firstName: "Alice",
          lastName: "Smith",
        }),
        update: expect.objectContaining({
          email: "alice@example.com",
        }),
      }),
    );
  });

  it("records the webhook event for idempotency on user.created", async () => {
    const evt = mockEvent("user.created", {
      id: "clerk_user_1",
      email_addresses: [{ id: "ema_1", email_address: "alice@example.com" }],
      primary_email_address_id: "ema_1",
      first_name: "Alice",
      last_name: null,
      image_url: null,
    });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    await POST(req);

    expect(mockTx.clerkWebhookEvent.create).toHaveBeenCalledWith({
      data: { id: "evt_001", type: "user.created" },
    });
  });

  it("skips User upsert when no email is available", async () => {
    const evt = mockEvent("user.created", {
      id: "clerk_user_2",
      email_addresses: [],
      primary_email_address_id: null,
      first_name: null,
      last_name: null,
      image_url: null,
    });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockTx.user.upsert).not.toHaveBeenCalled();
  });

  // ── user.updated ─────────────────────────────────────────────────────────

  it("upserts User on user.updated", async () => {
    const evt = mockEvent("user.updated", {
      id: "clerk_user_1",
      email_addresses: [{ id: "ema_2", email_address: "alice2@example.com" }],
      primary_email_address_id: "ema_2",
      first_name: "Alice",
      last_name: "Updated",
      image_url: null,
    });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(mockTx.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkUserId: "clerk_user_1" },
        update: expect.objectContaining({
          email: "alice2@example.com",
          firstName: "Alice",
          lastName: "Updated",
        }),
      }),
    );
  });

  // ── user.deleted ─────────────────────────────────────────────────────────

  it("soft-deletes User and memberships on user.deleted", async () => {
    const evt = mockEvent("user.deleted", {
      id: "clerk_user_1",
      deleted: true,
    });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(mockTx.user.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkUserId: "clerk_user_1", deletedAt: null },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }),
    );

    expect(mockTx.tenantUserMembership.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "clerk_user_1", deletedAt: null },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }),
    );
  });

  // ── Unknown events ────────────────────────────────────────────────────────

  it("returns 200 and no-ops for unknown event types", async () => {
    const evt = mockEvent("organization.created", { id: "org_1" });
    mockVerify.mockReturnValue(evt);

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(mockTx.user.upsert).not.toHaveBeenCalled();
  });

  // ── Transaction failure ───────────────────────────────────────────────────

  it("returns 500 when the transaction throws", async () => {
    const evt = mockEvent("user.created", {
      id: "clerk_user_err",
      email_addresses: [{ id: "ema_1", email_address: "err@example.com" }],
      primary_email_address_id: "ema_1",
      first_name: null,
      last_name: null,
      image_url: null,
    });
    mockVerify.mockReturnValue(evt);

    vi.mocked(prisma.$transaction).mockRejectedValueOnce(new Error("DB error"));

    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/failed/i);
  });
});
