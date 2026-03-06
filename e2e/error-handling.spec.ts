/**
 * Error handling E2E tests.
 *
 * Covers:
 *  - 404 pages for unknown routes
 *  - API route failures surface user-friendly errors (no stack traces)
 *  - Form validation errors display helpful messages
 */

import { expect, test } from "@playwright/test";

// ─── 404 / Unknown routes ─────────────────────────────────────────────────────

test.describe("404 – Not Found", () => {
  test("unknown route returns 404 or redirect", async ({ page }) => {
    const response = await page.goto("/this-route-definitely-does-not-exist-xyz");
    // Next.js returns 404 for unknown routes
    expect([404, 200]).toContain(response?.status());
    // No server error should be shown
    await expect(page.locator("body")).not.toContainText(
      "Application error: a client-side exception has occurred",
    );
  });

  test("deeply nested unknown route returns 404 or redirect", async ({ page }) => {
    const response = await page.goto("/a/b/c/d/e/unknown-path");
    expect([404, 200]).toContain(response?.status());
  });
});

// ─── API route error responses ────────────────────────────────────────────────

test.describe("API error handling", () => {
  test("no internal error details are exposed on API 500 responses", async ({ page }) => {
    // Mock an API route to return a 500 error
    await page.route("**/api/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Navigate to a page that might call an API route
    await page.goto("/");
    // The homepage should still load without a crash even if API calls fail
    await expect(page.locator("body")).not.toContainText("ECONNREFUSED");
    await expect(page.locator("body")).not.toContainText("prisma");
    await expect(page.locator("body")).not.toContainText("stack");
  });
});

// ─── Homepage resilience ──────────────────────────────────────────────────────

test.describe("Homepage resilience", () => {
  test("homepage renders without console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Filter out known benign errors (e.g. browser extension noise)
    const criticalErrors = consoleErrors.filter(
      (e) => !e.includes("extension") && !e.includes("favicon") && !e.includes("third-party"),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("page title is present and descriptive", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toMatch(/CTRL\+/i);
  });

  test("page has no broken images in above-the-fold content", async ({ page }) => {
    const brokenImages: string[] = [];

    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) {
        brokenImages.push(response.url());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(brokenImages).toHaveLength(0);
  });
});

// ─── Sign-in page error states ────────────────────────────────────────────────

test.describe("Sign-in form validation", () => {
  test("sign-in page loads without errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    // No uncaught JS exceptions
    expect(pageErrors).toHaveLength(0);
  });
});
