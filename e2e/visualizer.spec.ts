import { test, expect } from "@playwright/test";

/**
 * Minimal valid 1×1 JPEG as a byte buffer.
 * Used in tests so we don't need an external fixture file.
 */
const TINY_JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRof" +
    "Hh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wgARCAABAAEDASIAAhEBAxEB" +
    "/8QAFAABAAAAAAAAAAAAAAAAAAAACP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQAA" +
    "ABNA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJn/8QAFBEBAAAAAAAAAAAAAAAAAAA" +
    "AAP/aAAgBAwEBPwFn/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwFn/8QAFhAAAwAAAAAA" +
    "AAAAAAAAAAAAECEx/9oACAEBAAY/AmP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IWf/" +
    "2gAMAwEAAgADAAAAEAf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EH//xAAUEQEAAAAA" +
    "AAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFBABAAAAAAAAAAAAAAAAAAAAoP/aAAgBAQABPxB4f/Z",
  "base64"
);

test.describe("Visualizer — happy path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizer");
  });

  test("page loads and displays the visualizer heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /wrap visualizer/i })
    ).toBeVisible();
  });

  test("shows the upload zone on initial load", async ({ page }) => {
    await expect(
      page.getByRole("region", { name: /vehicle photo upload zone/i })
    ).toBeVisible();

    // Accessibility: upload trigger is keyboard-focusable
    const uploadBtn = page.getByRole("button", {
      name: /drop your vehicle photo|browse files/i,
    });
    await expect(uploadBtn).toBeVisible();
  });

  test("shows the saved previews section (empty state)", async ({ page }) => {
    await expect(
      page.getByRole("region", { name: /saved preview sessions/i })
    ).toBeVisible();

    await expect(page.getByText(/no saved previews yet/i)).toBeVisible();
  });

  test("accepts a JPEG upload and transitions to preview", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "my-car.jpg",
      mimeType: "image/jpeg",
      buffer: TINY_JPEG,
    });

    // Preview canvas must appear
    await expect(page.getByTestId("preview-canvas")).toBeVisible({
      timeout: 8_000,
    });

    // Upload zone must disappear
    await expect(
      page.getByRole("region", { name: /vehicle photo upload zone/i })
    ).not.toBeVisible();
  });

  test("preview shows wrap color selector and save button", async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "my-car.jpg",
      mimeType: "image/jpeg",
      buffer: TINY_JPEG,
    });

    await expect(page.getByTestId("preview-canvas")).toBeVisible({
      timeout: 8_000,
    });

    // Wrap color options should be visible
    await expect(
      page.getByRole("group", { name: /wrap color options/i })
    ).toBeVisible();

    // Save and reset buttons should be available
    await expect(
      page.getByRole("button", { name: /save preview/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /upload different photo/i })
    ).toBeVisible();
  });

  test("reset button returns to upload zone", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "my-car.jpg",
      mimeType: "image/jpeg",
      buffer: TINY_JPEG,
    });

    await expect(page.getByTestId("preview-canvas")).toBeVisible({
      timeout: 8_000,
    });

    await page.getByRole("button", { name: /upload different photo/i }).click();

    await expect(
      page.getByRole("region", { name: /vehicle photo upload zone/i })
    ).toBeVisible();
    await expect(page.getByTestId("preview-canvas")).not.toBeVisible();
  });

  test("shows error alert for an unsupported file type", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "report.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 fake content"),
    });

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText(/jpeg, png, or webp/i)).toBeVisible();
  });
});
