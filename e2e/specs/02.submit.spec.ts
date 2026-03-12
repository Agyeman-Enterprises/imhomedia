import { test, expect } from "@playwright/test";
import { env } from "../env";

test.describe("Track submission form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(env.routes.submit);
  });

  test("submit form is visible", async ({ page }) => {
    await expect(page.getByTestId("submit-form")).toBeVisible();
  });

  test("submit button is visible", async ({ page }) => {
    await expect(page.getByTestId("submit-btn")).toBeVisible();
  });

  test("submit button label is 'Submit Your Track'", async ({ page }) => {
    await expect(page.getByTestId("submit-btn")).toHaveText(/Submit Your Track/i);
  });

  test("form shows success state after valid submission", async ({ page }) => {
    // Fill in all required fields
    await page.fill("#artistName", "Test Artist");
    await page.fill("#trackTitle", "Test Track Title");
    await page.selectOption("#genre", "Jazz");
    await page.fill("#trackLink", "https://soundcloud.com/test/track");
    await page.fill("#email", "test@example.com");

    // Submit the form
    await page.getByTestId("submit-btn").click();

    // Wait for the success state to appear
    await expect(page.getByTestId("success-toast")).toBeVisible({ timeout: 10_000 });
  });

  test("form requires all fields before submit", async ({ page }) => {
    // Click submit without filling anything
    await page.getByTestId("submit-btn").click();

    // Browser native validation should prevent submission
    // The success toast must NOT appear
    await expect(page.getByTestId("success-toast")).not.toBeVisible();
  });
});
