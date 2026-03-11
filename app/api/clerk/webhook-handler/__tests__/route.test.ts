import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    clerkWebhookEvent: {
      create: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  claimClerkWebhookEvent,
  isClerkSubscriptionSyncEnabled,
  shouldSkipWebhookEventInCurrentEnv,
} from "../route";

describe("clerk webhook env gating", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC;
  });

  it("disables subscription sync in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(isClerkSubscriptionSyncEnabled()).toBe(false);
    expect(shouldSkipWebhookEventInCurrentEnv("subscription.created")).toBe(true);
  });

  it("allows subscription sync in development unless explicitly disabled", () => {
    vi.stubEnv("NODE_ENV", "development");
    process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC = "true";

    expect(isClerkSubscriptionSyncEnabled()).toBe(true);
    expect(shouldSkipWebhookEventInCurrentEnv("subscription.created")).toBe(false);
  });

  it("skips dev-only events when sync disabled", () => {
    vi.stubEnv("NODE_ENV", "development");
    process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC = "false";

    expect(shouldSkipWebhookEventInCurrentEnv("paymentAttempt.created")).toBe(true);
    expect(shouldSkipWebhookEventInCurrentEnv("user.created")).toBe(false);
  });
});

describe("clerk webhook idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("claims unseen events for processing", async () => {
    vi.mocked(prisma.clerkWebhookEvent.create).mockResolvedValue({} as never);

    const state = await claimClerkWebhookEvent("evt_1", "user.created");

    expect(state).toBe("process");
  });

  it("returns processed for previously processed events", async () => {
    vi.mocked(prisma.clerkWebhookEvent.create).mockRejectedValue({ code: "P2002" });
    vi.mocked(prisma.clerkWebhookEvent.findUnique).mockResolvedValue({
      status: "processed",
    } as never);

    const state = await claimClerkWebhookEvent("evt_2", "user.updated");

    expect(state).toBe("processed");
  });
});
