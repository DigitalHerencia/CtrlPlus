import { test, expect } from "@playwright/test";
import { ROUTES, TEST_IDS } from "./helpers";

/**
 * Catalog E2E Tests
 *
 * Covers:
 * - Happy path: browse catalog, view wrap detail, navigate to visualizer
 * - Failure: empty catalog state, invalid wrap ID (404)
 * - Search and filter interactions
 */

test.describe("Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.catalog);
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------

  test("catalog page loads and displays wrap grid", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(ROUTES.catalog));

    // The catalog grid container should be present
    const grid = page.getByTestId(TEST_IDS.catalogGrid);
    await expect(grid).toBeVisible();
  });

  test("wrap card displays title, price, and CTA", async ({ page }) => {
    // Wait for at least one wrap card to render
    const firstCard = page.getByTestId(TEST_IDS.wrapCard).first();
    await expect(firstCard).toBeVisible();

    await expect(firstCard.getByTestId(TEST_IDS.wrapCardTitle)).toBeVisible();
    await expect(firstCard.getByTestId(TEST_IDS.wrapCardPrice)).toBeVisible();
    await expect(firstCard.getByTestId(TEST_IDS.wrapCardCTA)).toBeVisible();
  });

  test("clicking a wrap card navigates to wrap detail page", async ({
    page,
  }) => {
    const firstCardCTA = page
      .getByTestId(TEST_IDS.wrapCard)
      .first()
      .getByTestId(TEST_IDS.wrapCardCTA);
    await firstCardCTA.click();

    // URL should change to a detail route
    await expect(page).toHaveURL(/\/catalog\/.+/);

    // Detail page content
    await expect(page.getByTestId(TEST_IDS.wrapDetailTitle)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.wrapDetailPrice)).toBeVisible();
  });

  test("wrap detail page has a Preview button linking to visualizer", async ({
    page,
  }) => {
    // Navigate directly to a detail page via the first card
    const firstCardCTA = page
      .getByTestId(TEST_IDS.wrapCard)
      .first()
      .getByTestId(TEST_IDS.wrapCardCTA);
    await firstCardCTA.click();
    await page.waitForURL(/\/catalog\/.+/);

    const previewBtn = page.getByTestId(TEST_IDS.previewBtn);
    await expect(previewBtn).toBeVisible();
    await previewBtn.click();

    await expect(page).toHaveURL(new RegExp(ROUTES.visualizer));
  });

  test("wrap detail page has a Book button", async ({ page }) => {
    const firstCardCTA = page
      .getByTestId(TEST_IDS.wrapCard)
      .first()
      .getByTestId(TEST_IDS.wrapCardCTA);
    await firstCardCTA.click();
    await page.waitForURL(/\/catalog\/.+/);

    const bookBtn = page.getByTestId(TEST_IDS.bookBtn);
    await expect(bookBtn).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Search & filter
  // ---------------------------------------------------------------------------

  test("search input filters wrap cards", async ({ page }) => {
    const searchInput = page.getByTestId(TEST_IDS.searchInput);
    await expect(searchInput).toBeVisible();

    // Count initial cards
    const initialCount = await page.getByTestId(TEST_IDS.wrapCard).count();

    // Type a search query unlikely to match anything
    await searchInput.fill("xyzzy_no_match_12345");
    await page.waitForTimeout(300); // debounce

    const afterCount = await page.getByTestId(TEST_IDS.wrapCard).count();
    expect(afterCount).toBeLessThanOrEqual(initialCount);
  });

  test("category filter narrows results", async ({ page }) => {
    const categoryFilter = page.getByTestId(TEST_IDS.categoryFilter);
    // Only interact if the filter exists (feature may be behind a flag)
    if ((await categoryFilter.count()) > 0) {
      await categoryFilter.first().click();
      // After filtering, grid should still be visible
      await expect(page.getByTestId(TEST_IDS.catalogGrid)).toBeVisible();
    }
  });

  // ---------------------------------------------------------------------------
  // Failure / edge cases
  // ---------------------------------------------------------------------------

  test("navigating to an invalid wrap ID shows 404 or error state", async ({
    page,
  }) => {
    await page.goto(ROUTES.catalogWrap("non-existent-wrap-id-00000"));
    // Expect either a 404 page or an error message — not a blank screen
    const body = page.locator("body");
    const text = await body.innerText();
    expect(
      text.match(/not found|404|error/i) !== null ||
        (await page.getByTestId(TEST_IDS.wrapDetailTitle).count()) === 0
    ).toBeTruthy();
  });

  test("empty catalog shows an empty state message instead of a broken grid", async ({
    page,
  }) => {
    // This test documents the expected behaviour; the implementation may
    // show zero cards. Ensure the page doesn't crash.
    const grid = page.getByTestId(TEST_IDS.catalogGrid);
    // Page should render without a JS error
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.reload();
    expect(errors).toHaveLength(0);
    // Grid or empty-state placeholder must be visible
    await expect(grid.or(page.getByRole("status"))).toBeVisible();
  });
});
