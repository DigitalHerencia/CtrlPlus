import { expect, test } from "@playwright/test";

test.describe("Clerk Surface Smoke", () => {
  test("sign-in page loads without server error", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).not.toContainText("Application error");
    await expect(page.locator("body")).not.toContainText("500");
  });

  test("sign-up page loads without server error", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).not.toContainText("Application error");
    await expect(page.locator("body")).not.toContainText("500");
  });
});
