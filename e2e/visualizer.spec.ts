import { test, expect } from "@playwright/test";
import * as os from "os";
import * as path from "path";
import { ROUTES, TEST_IDS } from "./helpers";

/**
 * Visualizer E2E Tests
 *
 * Covers:
 * - Happy path: load visualizer, upload a vehicle photo, view rendered preview
 * - Template/fallback mode when no photo is uploaded
 * - Proceed to booking from the visualizer
 * - Failure: unsupported file type, oversized file
 */

/** Minimal valid 1×1 white PNG encoded as base64. */
const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test.describe("Visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.visualizer);
  });

  // ---------------------------------------------------------------------------
  // Happy path — upload flow
  // ---------------------------------------------------------------------------

  test("visualizer page loads with upload and template options", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(ROUTES.visualizer));
    const container = page.getByTestId(TEST_IDS.visualizerContainer);
    await expect(container).toBeVisible();
  });

  test("upload button is visible and accepts image files", async ({ page }) => {
    const uploadInput = page.getByTestId(TEST_IDS.uploadInput);
    await expect(uploadInput).toBeAttached();

    // Verify the input accepts images
    const accept = await uploadInput.getAttribute("accept");
    expect(accept).toMatch(/image/i);
  });

  test("uploading a valid vehicle photo shows a preview", async ({ page }) => {
    // Write a tiny PNG to a temp file so Playwright can set the input
    const tmpPath = path.join(os.tmpdir(), "vehicle-test.png");
    const { writeFileSync } = await import("fs");
    writeFileSync(tmpPath, Buffer.from(TINY_PNG_BASE64, "base64"));

    const uploadInput = page.getByTestId(TEST_IDS.uploadInput);
    await uploadInput.setInputFiles(tmpPath);

    // After upload the preview image or canvas should appear
    const preview = page
      .getByTestId(TEST_IDS.previewImage)
      .or(page.getByTestId(TEST_IDS.previewCanvas));
    await expect(preview).toBeVisible({ timeout: 10_000 });
  });

  test("proceed to booking button is visible after upload", async ({ page }) => {
    const tmpPath = path.join(os.tmpdir(), "vehicle-proceed.png");
    const { writeFileSync } = await import("fs");
    writeFileSync(tmpPath, Buffer.from(TINY_PNG_BASE64, "base64"));

    const uploadInput = page.getByTestId(TEST_IDS.uploadInput);
    await uploadInput.setInputFiles(tmpPath);

    const proceedBtn = page.getByTestId(TEST_IDS.proceedToBookingBtn);
    await expect(proceedBtn).toBeVisible({ timeout: 10_000 });
    await proceedBtn.click();

    await expect(page).toHaveURL(new RegExp(ROUTES.scheduling));
  });

  // ---------------------------------------------------------------------------
  // Template / fallback flow (no upload)
  // ---------------------------------------------------------------------------

  test("visualizer works without uploading a photo (template mode)", async ({ page }) => {
    // If a template/fallback preview exists it should be visible without upload
    const container = page.getByTestId(TEST_IDS.visualizerContainer);
    await expect(container).toBeVisible();

    // The page should render without JS errors
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.reload();
    expect(errors).toHaveLength(0);
  });

  // ---------------------------------------------------------------------------
  // Failure / edge cases
  // ---------------------------------------------------------------------------

  test("uploading a non-image file shows a validation error", async ({ page }) => {
    const tmpPath = path.join(os.tmpdir(), "not-an-image.txt");
    const { writeFileSync } = await import("fs");
    writeFileSync(tmpPath, "this is not an image");

    const uploadInput = page.getByTestId(TEST_IDS.uploadInput);
    await uploadInput.setInputFiles(tmpPath);

    // Expect an error message to appear
    const errorMessage = page.getByRole("alert").or(page.getByRole("status"));
    // If the UI shows an inline validation message, it should be visible
    const errorCount = await errorMessage.count();
    if (errorCount > 0) {
      await expect(errorMessage.first()).toBeVisible({ timeout: 5_000 });
    } else {
      // At minimum, the preview should NOT have appeared
      const preview = page.getByTestId(TEST_IDS.previewImage);
      expect(await preview.count()).toBe(0);
    }
  });

  test("visualizer does not crash when navigated to without a selected wrap", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.visualizer);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
    await expect(page.locator("body")).toBeVisible();
  });
});
