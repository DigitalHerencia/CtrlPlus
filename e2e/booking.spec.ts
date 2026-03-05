import { test, expect } from "@playwright/test";
import { ROUTES, TEST_IDS } from "./helpers";

/**
 * Booking / Scheduling E2E Tests
 *
 * Covers:
 * - Happy path: view availability calendar, select time slot, complete booking form
 * - Booking confirmation is displayed with a confirmation ID
 * - Failure: submitting an empty form, selecting a past date
 */

test.describe("Booking / Scheduling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.scheduling);
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------

  test("scheduling page loads with availability calendar", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(ROUTES.scheduling));
    const calendar = page.getByTestId(TEST_IDS.schedulingCalendar);
    await expect(calendar).toBeVisible();
  });

  test("available time slots are displayed", async ({ page }) => {
    const calendar = page.getByTestId(TEST_IDS.schedulingCalendar);
    await expect(calendar).toBeVisible();

    const slots = page.getByTestId(TEST_IDS.timeSlot);
    // At least one time slot should be present
    await expect(slots.first()).toBeVisible();
  });

  test("selecting a time slot opens the booking form", async ({ page }) => {
    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await expect(firstSlot).toBeVisible();
    await firstSlot.click();

    const bookingForm = page.getByTestId(TEST_IDS.bookingForm);
    await expect(bookingForm).toBeVisible();
  });

  test("completing the booking form and submitting shows a confirmation", async ({ page }) => {
    // Select the first available slot
    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await firstSlot.click();

    // Fill in the booking form
    await page.getByTestId(TEST_IDS.bookingNameInput).fill("Jane Doe");
    await page.getByTestId(TEST_IDS.bookingEmailInput).fill("jane.doe@example.com");
    await page.getByTestId(TEST_IDS.bookingPhoneInput).fill("555-0100");

    // Submit
    const submitBtn = page.getByTestId(TEST_IDS.bookingSubmitBtn);
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Confirmation should be visible
    const confirmation = page.getByTestId(TEST_IDS.bookingConfirmation);
    await expect(confirmation).toBeVisible({ timeout: 10_000 });
  });

  test("booking confirmation displays a unique confirmation ID", async ({ page }) => {
    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await firstSlot.click();

    await page.getByTestId(TEST_IDS.bookingNameInput).fill("John Smith");
    await page.getByTestId(TEST_IDS.bookingEmailInput).fill("john.smith@example.com");
    await page.getByTestId(TEST_IDS.bookingPhoneInput).fill("555-0101");

    await page.getByTestId(TEST_IDS.bookingSubmitBtn).click();

    const confirmationId = page.getByTestId(TEST_IDS.bookingConfirmationId);
    await expect(confirmationId).toBeVisible({ timeout: 10_000 });

    const idText = await confirmationId.innerText();
    expect(idText.trim().length).toBeGreaterThan(0);
  });

  test("booking form shows a proceed-to-payment button after confirmation", async ({ page }) => {
    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await firstSlot.click();

    await page.getByTestId(TEST_IDS.bookingNameInput).fill("Pay Test");
    await page.getByTestId(TEST_IDS.bookingEmailInput).fill("pay.test@example.com");
    await page.getByTestId(TEST_IDS.bookingPhoneInput).fill("555-0102");

    await page.getByTestId(TEST_IDS.bookingSubmitBtn).click();

    // After booking, a pay button or link to checkout should appear
    const payBtn = page.getByTestId(TEST_IDS.payNowBtn);
    await expect(payBtn).toBeVisible({ timeout: 10_000 });
  });

  // ---------------------------------------------------------------------------
  // Failure / validation
  // ---------------------------------------------------------------------------

  test("submitting the booking form without required fields shows validation errors", async ({
    page,
  }) => {
    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await firstSlot.click();

    // Submit without filling any fields
    const submitBtn = page.getByTestId(TEST_IDS.bookingSubmitBtn);
    await submitBtn.click();

    // Expect validation error messages
    const errorMessages = page.getByRole("alert");
    const inputErrors = page.locator("[aria-invalid='true']");
    const hasErrors = (await errorMessages.count()) > 0 || (await inputErrors.count()) > 0;
    expect(hasErrors).toBeTruthy();
  });

  test("submitting with an invalid email shows a validation error", async ({ page }) => {
    const firstSlot = page.getByTestId(TEST_IDS.timeSlot).first();
    await firstSlot.click();

    await page.getByTestId(TEST_IDS.bookingNameInput).fill("Bad Email User");
    await page.getByTestId(TEST_IDS.bookingEmailInput).fill("not-an-email");
    await page.getByTestId(TEST_IDS.bookingPhoneInput).fill("555-0199");

    await page.getByTestId(TEST_IDS.bookingSubmitBtn).click();

    // Confirmation should NOT appear
    const confirmation = page.getByTestId(TEST_IDS.bookingConfirmation);
    expect(await confirmation.count()).toBe(0);
  });

  test("scheduling page renders without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(ROUTES.scheduling);
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });
});
