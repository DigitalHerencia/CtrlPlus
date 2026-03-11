import { test as base, type Page } from "@playwright/test";

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockWraps = [
  {
    id: "wrap-001",
    name: "Matte Black Full Wrap",
    description: "Premium matte black vinyl wrap for full vehicle coverage.",
    price: 120000,
    installationMinutes: 480,
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-02").toISOString(),
  },
  {
    id: "wrap-002",
    name: "Gloss White Partial Wrap",
    description: "High-gloss white vinyl for partial vehicle coverage.",
    price: 75000,
    installationMinutes: 240,
    createdAt: new Date("2024-01-03").toISOString(),
    updatedAt: new Date("2024-01-04").toISOString(),
  },
  {
    id: "wrap-003",
    name: "Carbon Fiber Accent Wrap",
    description: "Carbon fiber texture vinyl for accent panels.",
    price: 45000,
    installationMinutes: 120,
    createdAt: new Date("2024-01-05").toISOString(),
    updatedAt: new Date("2024-01-06").toISOString(),
  },
];

export const mockWrapListResponse = {
  wraps: mockWraps,
  total: mockWraps.length,
  page: 1,
  pageSize: 20,
  totalPages: 1,
};

export const mockAvailabilityWindows = [
  {
    id: "avail-001",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "17:00",
    capacity: 3,
    isActive: true,
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "avail-002",
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "17:00",
    capacity: 3,
    isActive: true,
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
];

export const mockBooking = {
  id: "booking-001",
  customerId: "user-test",
  wrapId: "wrap-001",
  dropOffStart: new Date("2024-03-10T08:00:00.000Z").toISOString(),
  dropOffEnd: new Date("2024-03-10T09:00:00.000Z").toISOString(),
  pickUpStart: new Date("2024-03-11T08:00:00.000Z").toISOString(),
  pickUpEnd: new Date("2024-03-11T09:00:00.000Z").toISOString(),
  status: "PENDING",
  createdAt: new Date("2024-03-09").toISOString(),
  updatedAt: new Date("2024-03-09").toISOString(),
};

export const mockInvoice = {
  id: "invoice-001",
  customerId: "user-test",
  bookingId: "booking-001",
  status: "draft",
  totalAmount: 120000,
  stripeInvoiceId: null,
  createdAt: new Date("2024-03-09").toISOString(),
  updatedAt: new Date("2024-03-09").toISOString(),
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

interface E2EFixtures {
  /**
   * Page with all API routes intercepted and returning mock data.
   * Use this for tests that do not require real backend/auth interaction.
   */
  mockedPage: Page;
  /**
   * Helper to navigate to a route and wait for the page to settle.
   */
  goto: (path: string) => Promise<void>;
}

export const test = base.extend<E2EFixtures>({
  mockedPage: async ({ page }, use) => {
    // Intercept Next.js API routes with mock data
    await page.route("**/api/wraps/*", async (route) => {
      const url = route.request().url();
      const id = url.split("/").pop();
      const wrap = mockWraps.find((w) => w.id === id) ?? mockWraps[0];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(wrap),
      });
    });

    await page.route(/\/api\/wraps(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockWrapListResponse),
      });
    });

    await page.route("**/api/availability**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: mockAvailabilityWindows,
          total: mockAvailabilityWindows.length,
          page: 1,
          pageSize: 20,
          totalPages: 1,
        }),
      });
    });

    await page.route("**/api/bookings**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockBooking),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [mockBooking],
            total: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1,
          }),
        });
      }
    });

    await page.route("**/api/billing/checkout**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sessionId: "cs_test_mock_session_id",
          url: "https://checkout.stripe.com/pay/cs_test_mock",
        }),
      });
    });

    await use(page);
  },

  goto: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(path);
      await page.waitForLoadState("domcontentloaded");
    });
  },
});

export { expect } from "@playwright/test";
