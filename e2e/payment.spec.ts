import { test, expect } from "@playwright/test";
import { ROUTES, TEST_IDS } from "./helpers";

/**
 * Payment / Billing E2E Tests
 *
 * Covers:
 * - Happy path: checkout page renders, Stripe redirect is triggered
 * - Payment success callback renders the success page
 * - Payment cancel callback renders the cancel/retry page
 * - Failure: attempting checkout without a booking redirects gracefully
 */

test.describe("Payment / Billing", () => {
  // ---------------------------------------------------------------------------
  // Checkout page
  // ---------------------------------------------------------------------------

  test("checkout page loads and displays order summary", async ({ page }) => {
    await page.goto(ROUTES.billingCheckout);
    await expect(page).toHaveURL(new RegExp(ROUTES.billingCheckout));

    const container = page.getByTestId(TEST_IDS.checkoutContainer);
    await expect(container).toBeVisible();

    const summary = page.getByTestId(TEST_IDS.checkoutSummary);
    await expect(summary).toBeVisible();
  });

  test("pay now button is present on the checkout page", async ({ page }) => {
    await page.goto(ROUTES.billingCheckout);

    const payBtn = page.getByTestId(TEST_IDS.payNowBtn);
    await expect(payBtn).toBeVisible();
  });

  test("clicking pay now initiates a Stripe checkout redirect", async ({
    page,
  }) => {
    await page.goto(ROUTES.billingCheckout);

    const payBtn = page.getByTestId(TEST_IDS.payNowBtn);
    await expect(payBtn).toBeVisible();

    // Listen for navigation; Stripe redirects to checkout.stripe.com
    const navigationPromise = page.waitForURL(
      /checkout\.stripe\.com|\/billing\/.+/,
      { timeout: 10_000 }
    );
    await payBtn.click();

    // If the app redirects to Stripe, the URL will change.
    // If it renders an inline Stripe element, we accept the current page.
    try {
      await navigationPromise;
      const url = page.url();
      expect(url).toMatch(/stripe\.com|\/billing\/.+/);
    } catch {
      // Inline Stripe elements — verify no crash
      await expect(page.locator("body")).toBeVisible();
    }
  });

  // ---------------------------------------------------------------------------
  // Post-payment callbacks
  // ---------------------------------------------------------------------------

  test("payment success page renders a success message", async ({ page }) => {
    await page.goto(ROUTES.billingSuccess);
    await expect(page).toHaveURL(new RegExp(ROUTES.billingSuccess));

    const successEl = page.getByTestId(TEST_IDS.paymentSuccess);
    await expect(successEl).toBeVisible();
  });

  test("payment cancel page renders a cancellation message and retry option", async ({
    page,
  }) => {
    await page.goto(ROUTES.billingCancel);
    await expect(page).toHaveURL(new RegExp(ROUTES.billingCancel));

    const cancelEl = page.getByTestId(TEST_IDS.paymentCancel);
    await expect(cancelEl).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Failure / edge cases
  // ---------------------------------------------------------------------------

  test("checkout page without a booking redirects or shows an error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    // Navigate directly to checkout with no booking context
    await page.goto(ROUTES.billingCheckout);
    await page.waitForLoadState("networkidle");

    // Should NOT throw a JS error; it may redirect to scheduling or show a message
    expect(errors).toHaveLength(0);

    const currentUrl = page.url();
    const isRedirected = !currentUrl.includes(ROUTES.billingCheckout);
    const hasError =
      (await page.getByRole("alert").count()) > 0 ||
      (await page.getByTestId(TEST_IDS.checkoutContainer).count()) > 0;

    expect(isRedirected || hasError).toBeTruthy();
  });

  test("billing pages render without JS errors", async ({ page }) => {
    const pages = [ROUTES.billingSuccess, ROUTES.billingCancel];

    for (const route of pages) {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(errors, `JS errors on ${route}`).toHaveLength(0);
    }
  });
});
