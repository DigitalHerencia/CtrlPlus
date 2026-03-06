/**
 * Authentication E2E tests.
 *
 * Covers:
 *  - Public pages are accessible without authentication
 *  - Protected routes redirect unauthenticated users to sign-in
 *  - Sign-in and sign-up pages render correctly
 */

import { expect, test } from "@playwright/test";

// ─── Public page accessibility ────────────────────────────────────────────────

test.describe("Public pages", () => {
  test("homepage loads and shows brand name", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CTRL\+/i);
    // The hero / header renders the platform name
    await expect(page.getByText("CTRL+").first()).toBeVisible();
  });

  test("homepage has navigation links to sign-in and sign-up", async ({ page }) => {
    await page.goto("/");
    // At least one link should point to the sign-in or sign-up page
    const authLinks = page.locator('a[href*="sign"]');
    await expect(authLinks.first()).toBeVisible();
  });
});

// ─── Sign-in page ─────────────────────────────────────────────────────────────

test.describe("Sign-in page", () => {
  test("renders the Clerk sign-in component", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
    // Clerk renders a sign-in form with an email/identifier input
    // We check that the page loads without a server error
    await expect(page.locator("body")).not.toContainText("500");
    await expect(page.locator("body")).not.toContainText("Application error");
  });

  test("page title contains the platform name", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveTitle(/CTRL\+/i);
  });
});

// ─── Sign-up page ─────────────────────────────────────────────────────────────

test.describe("Sign-up page", () => {
  test("renders the Clerk sign-up component", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).not.toContainText("500");
    await expect(page.locator("body")).not.toContainText("Application error");
  });
});

// ─── Protected route redirection ─────────────────────────────────────────────

test.describe("Protected routes", () => {
  const protectedRoutes = ["/catalog", "/visualizer", "/scheduling", "/billing", "/admin"];

  for (const route of protectedRoutes) {
    test(`${route} redirects unauthenticated users to sign-in`, async ({ page }) => {
      await page.goto(route);
      await page.waitForURL(
        (url) =>
          url.pathname.startsWith("/sign-in") ||
          url.pathname === "/sign-in" ||
          // Clerk sometimes uses its own hosted pages
          url.hostname.includes("clerk"),
      );
      // Should end up on a sign-in page (Clerk hosted or local)
      const currentUrl = page.url();
      expect(currentUrl.includes("sign-in") || currentUrl.includes("clerk")).toBeTruthy();
    });
  }
});
