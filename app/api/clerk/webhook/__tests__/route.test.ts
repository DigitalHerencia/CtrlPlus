import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock declarations (must be hoisted before imports) ────────────────────
const mockVerifyWebhook = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  clerkWebhookEvent: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  clerkUser: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  tenantUserMembership: {
    deleteMany: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@clerk/nextjs/webhooks", () => ({
  verifyWebhook: mockVerifyWebhook,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

// ── Import handler after mocks are in place ───────────────────────────────
import { POST } from "../route";

// ── Test helpers ──────────────────────────────────────────────────────────

function makeRequest(svixId = "svix-abc-123"): NextRequest {
  return new NextRequest("https://example.com/api/clerk/webhook", {
    method: "POST",
    headers: { "svix-id": svixId },
    body: "{}",
  });
}

function makeUserCreatedEvent() {
  return {
    type: "user.created" as const,
    object: "event" as const,
    data: {
      id: "user_test_123",
      object: "user",
      first_name: "Alice",
      last_name: "Smith",
      image_url: "https://example.com/alice.jpg",
      primary_email_address_id: "email_1",
      email_addresses: [
        {
          id: "email_1",
          object: "email_address",
          email_address: "alice@example.com",
          verification: null,
          linked_to: [],
        },
      ],
      username: null,
      has_image: true,
      password_enabled: false,
      two_factor_enabled: false,
      totp_enabled: false,
      backup_code_enabled: false,
      phone_numbers: [],
      web3_wallets: [],
      organization_memberships: null,
      external_accounts: [],
      password_last_updated_at: null,
      public_metadata: {},
      private_metadata: {},
      unsafe_metadata: {},
      external_id: null,
      last_sign_in_at: null,
      banned: false,
      locked: false,
      lockout_expires_in_seconds: null,
      verification_attempts_remaining: null,
      created_at: Date.now(),
      updated_at: Date.now(),
      last_active_at: null,
      create_organization_enabled: true,
      create_organizations_limit: null,
      delete_self_enabled: true,
      legal_accepted_at: null,
      locale: null,
    },
    event_attributes: {
      http_request: { client_ip: "1.2.3.4", user_agent: "test" },
    },
  };
}

function makeUserDeletedEvent() {
  return {
    type: "user.deleted" as const,
    object: "event" as const,
    data: {
      object: "user",
      id: "user_test_123",
      deleted: true,
    },
    event_attributes: {
      http_request: { client_ip: "1.2.3.4", user_agent: "test" },
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("POST /api/clerk/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: event is not already in the DB (not a duplicate)
    mockPrisma.clerkWebhookEvent.findUnique.mockResolvedValue(null);
    mockPrisma.clerkWebhookEvent.create.mockResolvedValue({
      id: "evt_1",
      svixId: "svix-abc-123",
      eventType: "user.created",
      payload: {},
      processedAt: new Date(),
    });
  });

  // ── 1. Signature verification ──────────────────────────────────────────

  it("returns 400 when signature verification fails", async () => {
    mockVerifyWebhook.mockRejectedValueOnce(new Error("Bad signature"));

    const res = await POST(makeRequest());

    expect(res.status).toBe(400);
    const body = await res.text();
    expect(body).toContain("verification failed");
  });

  it("returns 400 when svix-id header is missing", async () => {
    mockVerifyWebhook.mockResolvedValueOnce({
      type: "user.created",
      object: "event",
      data: {},
      event_attributes: {
        http_request: { client_ip: "1.2.3.4", user_agent: "test" },
      },
    });

    const req = new NextRequest("https://example.com/api/clerk/webhook", {
      method: "POST",
      body: "{}",
      // No svix-id header
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.text();
    expect(body).toContain("svix-id");
  });

  // ── 2. Idempotency ────────────────────────────────────────────────────

  it("returns 200 and skips processing for duplicate svix-id", async () => {
    mockVerifyWebhook.mockResolvedValueOnce(makeUserCreatedEvent());
    mockPrisma.clerkWebhookEvent.findUnique.mockResolvedValueOnce({
      id: "existing-evt",
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toBe("Already processed");
    // User upsert must NOT have been called
    expect(mockPrisma.clerkUser.upsert).not.toHaveBeenCalled();
  });

  // ── 3. user.created ───────────────────────────────────────────────────

  it("upserts ClerkUser on user.created", async () => {
    const event = makeUserCreatedEvent();
    mockVerifyWebhook.mockResolvedValueOnce(event);
    mockPrisma.clerkUser.upsert.mockResolvedValueOnce({ id: "local-user-1" });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockPrisma.clerkUser.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkUserId: "user_test_123" },
        create: expect.objectContaining({
          clerkUserId: "user_test_123",
          email: "alice@example.com",
          firstName: "Alice",
          lastName: "Smith",
          imageUrl: "https://example.com/alice.jpg",
        }),
        update: expect.objectContaining({
          email: "alice@example.com",
          firstName: "Alice",
          lastName: "Smith",
          imageUrl: "https://example.com/alice.jpg",
        }),
      }),
    );
    // Idempotency record must be saved
    expect(mockPrisma.clerkWebhookEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          svixId: "svix-abc-123",
          eventType: "user.created",
        }),
      }),
    );
  });

  it("falls back to first email when primary_email_address_id is null", async () => {
    const event = makeUserCreatedEvent();
    event.data.primary_email_address_id = null as unknown as string;
    mockVerifyWebhook.mockResolvedValueOnce(event);
    mockPrisma.clerkUser.upsert.mockResolvedValueOnce({ id: "local-user-1" });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockPrisma.clerkUser.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ email: "alice@example.com" }),
      }),
    );
  });

  // ── 4. user.updated ───────────────────────────────────────────────────

  it("upserts ClerkUser on user.updated", async () => {
    const event = makeUserCreatedEvent();
    event.type = "user.updated" as "user.created";
    mockVerifyWebhook.mockResolvedValueOnce(event);
    mockPrisma.clerkUser.upsert.mockResolvedValueOnce({ id: "local-user-1" });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockPrisma.clerkUser.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkUserId: "user_test_123" },
      }),
    );
  });

  // ── 5. user.deleted ───────────────────────────────────────────────────

  it("deletes ClerkUser and memberships on user.deleted", async () => {
    const event = makeUserDeletedEvent();
    mockVerifyWebhook.mockResolvedValueOnce(event);

    // Simulate $transaction executing the callback
    mockPrisma.$transaction.mockImplementationOnce(
      async (fn: (tx: typeof mockPrisma) => Promise<void>) => {
        const txMock = {
          clerkUser: {
            findUnique: vi.fn().mockResolvedValue({ id: "local-user-1" }),
            delete: vi.fn().mockResolvedValue({ id: "local-user-1" }),
          },
          tenantUserMembership: {
            deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        await fn(txMock as unknown as typeof mockPrisma);
        // Assert inner calls
        expect(txMock.tenantUserMembership.deleteMany).toHaveBeenCalledWith({
          where: { userId: "local-user-1" },
        });
        expect(txMock.clerkUser.delete).toHaveBeenCalledWith({
          where: { id: "local-user-1" },
        });
      },
    );

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(mockPrisma.clerkWebhookEvent.create).toHaveBeenCalled();
  });

  it("handles user.deleted gracefully when no local record exists", async () => {
    const event = makeUserDeletedEvent();
    mockVerifyWebhook.mockResolvedValueOnce(event);

    mockPrisma.$transaction.mockImplementationOnce(
      async (fn: (tx: typeof mockPrisma) => Promise<void>) => {
        const txMock = {
          clerkUser: {
            findUnique: vi.fn().mockResolvedValue(null),
            delete: vi.fn(),
          },
          tenantUserMembership: { deleteMany: vi.fn() },
        };
        await fn(txMock as unknown as typeof mockPrisma);
        expect(txMock.clerkUser.delete).not.toHaveBeenCalled();
      },
    );

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
  });

  it("returns 500 when user.deleted event has no id", async () => {
    mockVerifyWebhook.mockResolvedValueOnce({
      type: "user.deleted",
      object: "event",
      data: { object: "user", deleted: true }, // no id
      event_attributes: {
        http_request: { client_ip: "1.2.3.4", user_agent: "test" },
      },
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(500);
    // $transaction should not have been called
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  // ── 6. Unhandled event types ──────────────────────────────────────────

  it("returns 200 for unhandled event types without mutation", async () => {
    mockVerifyWebhook.mockResolvedValueOnce({
      type: "session.created",
      object: "event",
      data: { id: "session_xyz" },
      event_attributes: {
        http_request: { client_ip: "1.2.3.4", user_agent: "test" },
      },
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockPrisma.clerkUser.upsert).not.toHaveBeenCalled();
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    // Idempotency record still saved
    expect(mockPrisma.clerkWebhookEvent.create).toHaveBeenCalled();
  });

  // ── 7. DB failure after signature verification → 500 for retry ────────

  it("returns 500 on DB error so Clerk retries delivery", async () => {
    const event = makeUserCreatedEvent();
    mockVerifyWebhook.mockResolvedValueOnce(event);
    mockPrisma.clerkUser.upsert.mockRejectedValueOnce(new Error("DB connection lost"));

    const res = await POST(makeRequest());

    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).toContain("Internal server error");
  });
});
