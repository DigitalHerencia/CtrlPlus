import { expect, test } from "@playwright/test";

test.describe("Domain Journey Smoke", () => {
  test("public homepage renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("CTRL+").first()).toBeVisible();
  });

  for (const route of ["/catalog", "/visualizer", "/scheduling", "/billing"]) {
    test(`${route} redirects anonymous users to sign-in`, async ({ page }) => {
      await page.goto(route);
      await page.waitForURL(
        (url) => url.pathname.startsWith("/sign-in") || url.hostname.includes("clerk"),
      );
      expect(page.url().includes("sign-in") || page.url().includes("clerk")).toBeTruthy();
    });
  }

  test("catalog not-found route returns not-found UI without runtime crash", async ({ page }) => {
    await page.goto("/catalog/non-existent-wrap");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).not.toContainText("Application error");
  });
});
