import { expect, test } from "@playwright/test";

test.describe("Error Surface Smoke", () => {
  test("unknown route renders without leaking stack traces", async ({ page }) => {
    const response = await page.goto("/this-route-definitely-does-not-exist-xyz");
    expect([404, 200]).toContain(response?.status());
    await expect(page.locator("body")).not.toContainText("ECONNREFUSED");
    await expect(page.locator("body")).not.toContainText("PrismaClient");
    await expect(page.locator("body")).not.toContainText("stack");
  });

  test("homepage does not throw uncaught page errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    expect(pageErrors).toHaveLength(0);
  });
});
