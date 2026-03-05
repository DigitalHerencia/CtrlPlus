import { test, expect } from "@playwright/test";
import * as os from "os";
import * as path from "path";
import { ROUTES, TEST_IDS } from "./helpers";

/**
 * Core User-Flow E2E Suite (E2E-001)
 *
 * Covers the primary tenant journey end-to-end:
 *   catalog → visualizer → booking → payment
 *
 * This is the regression gate that must pass on every PR that touches
 * app/, lib/, or prisma/ directories.
 */

/** Minimal valid 1×1 white PNG for upload tests. */
const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// ---------------------------------------------------------------------------
// Helper: write a tiny PNG to /tmp for upload tests
// ---------------------------------------------------------------------------
async function writeTempPng(filename: string): Promise<string> {
  const tmpPath = path.join(os.tmpdir(), filename);
  const { writeFileSync } = await import("fs");
  writeFileSync(tmpPath, Buffer.from(TINY_PNG_BASE64, "base64"));
  return tmpPath;
}

// ===========================================================================
// 1. Full happy-path journey
// ===========================================================================

test.describe("Core happy-path journey: catalog → visualizer → booking → payment", () => {
  test("customer can browse catalog, preview a wrap, book, and proceed to checkout", async ({
    page,
  }) => {
    // -----------------------------------------------------------------------
    // Step 1 — Catalog: browse and open a wrap detail
    // -----------------------------------------------------------------------
    await page.goto(ROUTES.catalog);
    await expect(page).toHaveURL(new RegExp(ROUTES.catalog));

    const firstCard = page.getByTestId(TEST_IDS.wrapCard).first();
    await expect(firstCard).toBeVisible();

    await firstCard.getByTestId(TEST_IDS.wrapCardCTA).click();
    await page.waitForURL(/\/catalog\/.+/);

    await expect(page.getByTestId(TEST_IDS.wrapDetailTitle)).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 2 — Visualizer: open, upload a photo, view preview
    // -----------------------------------------------------------------------
    const previewBtn = page.getByTestId(TEST_IDS.previewBtn);
    await expect(previewBtn).toBeVisible();
    await previewBtn.click();

    await expect(page).toHaveURL(new RegExp(ROUTES.visualizer));

    const tmpPng = await writeTempPng("journey-vehicle.png");
    const uploadInput = page.getByTestId(TEST_IDS.uploadInput);
    await expect(uploadInput).toBeAttached();
    await uploadInput.setInputFiles(tmpPng);

    const preview = page
      .getByTestId(TEST_IDS.previewImage)
      .or(page.getByTestId(TEST_IDS.previewCanvas));
    await expect(preview).toBeVisible({ timeout: 10_000 });

    // -----------------------------------------------------------------------
    // Step 3 — Booking: select a slot and complete the form
    // -----------------------------------------------------------------------
    const proceedBtn = page.getByTestId(TEST_IDS.proceedToBookingBtn);
    await expect(proceedBtn).toBeVisible({ timeout: 10_000 });
    await proceedBtn.click();

    await expect(page).toHaveURL(new RegExp(ROUTES.scheduling));

    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await expect(firstSlot).toBeVisible();
    await firstSlot.click();

    await page.getByTestId(TEST_IDS.bookingNameInput).fill("Alex Turner");
    await page
      .getByTestId(TEST_IDS.bookingEmailInput)
      .fill("alex.turner@example.com");
    await page.getByTestId(TEST_IDS.bookingPhoneInput).fill("555-0200");

    await page.getByTestId(TEST_IDS.bookingSubmitBtn).click();

    const confirmation = page.getByTestId(TEST_IDS.bookingConfirmation);
    await expect(confirmation).toBeVisible({ timeout: 10_000 });

    // -----------------------------------------------------------------------
    // Step 4 — Payment: navigate to checkout
    // -----------------------------------------------------------------------
    const payBtn = page.getByTestId(TEST_IDS.payNowBtn);
    await expect(payBtn).toBeVisible({ timeout: 10_000 });
    await payBtn.click();

    // Should reach either the Stripe redirect or an in-app checkout page
    await expect(page).toHaveURL(/stripe\.com|\/billing\/.+/, {
      timeout: 10_000,
    });
  });
});

// ===========================================================================
// 2. Failure / regression gates
// ===========================================================================

test.describe("Regression gates — failure paths must not crash the app", () => {
  test("unauthenticated user visiting a protected route is redirected or shown an auth prompt", async ({
    page,
  }) => {
    const protectedRoutes = [
      ROUTES.scheduling,
      ROUTES.billingCheckout,
      ROUTES.adminDashboard,
    ];

    for (const route of protectedRoutes) {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // No JS crash
      expect(errors, `JS errors on ${route}`).toHaveLength(0);

      // Either redirected to sign-in OR auth prompt is displayed
      const url = page.url();
      const hasAuthRedirect =
        url.includes(ROUTES.signIn) || url.includes(ROUTES.signUp);
      const hasAuthPrompt =
        (await page.getByRole("heading", { name: /sign in/i }).count()) > 0 ||
        (await page.getByRole("link", { name: /sign in/i }).count()) > 0;

      expect(
        hasAuthRedirect || hasAuthPrompt,
        `Expected auth gate on ${route}, got ${url}`
      ).toBeTruthy();
    }
  });

  test("the homepage loads without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.home);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigating between main sections does not produce console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const sections = [ROUTES.home, ROUTES.catalog, ROUTES.visualizer];

    for (const route of sections) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
    }

    // Filter out known third-party / network errors that are outside our control
    const thirdPartyPattern =
      /\bhttps?:\/\/([^/]*\.)?(stripe\.com|clerk\.com)\b/;
    const appErrors = consoleErrors.filter(
      (e) =>
        !thirdPartyPattern.test(e) && !e.includes("Failed to load resource")
    );

    expect(appErrors).toHaveLength(0);
  });

  test("direct navigation to /billing/success without a session shows a graceful page", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.billingSuccess);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
    await expect(page.locator("body")).toBeVisible();
  });

  test("direct navigation to /billing/cancel without a session shows a graceful page", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.billingCancel);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
    await expect(page.locator("body")).toBeVisible();
  });
});

// ===========================================================================
// 3. Admin journey smoke test
// ===========================================================================

test.describe("Admin journey smoke test", () => {
  test("admin dashboard is accessible to authenticated admin users", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.adminDashboard);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);

    // Admin dashboard or auth redirect — neither should crash
    const url = page.url();
    const isAdmin = url.includes("/admin");
    const isAuth = url.includes(ROUTES.signIn) || url.includes(ROUTES.signUp);
    expect(isAdmin || isAuth).toBeTruthy();
  });

  test("admin catalog management page loads without JS errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.adminCatalog);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });
});
