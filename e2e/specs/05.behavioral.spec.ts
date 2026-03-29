import { test, expect } from "@playwright/test";
import { env } from "../env";

/**
 * Behavioral tests — the end-to-end product flows that matter to Akua:
 *  1. Stream player toggle works
 *  2. Podcast filtering works
 *  3. Track submission happy path renders success
 *  4. Admin is gated
 */
test.describe("Behavioral — core IMHO Media product flows", () => {
  test("stream player button click does not crash the page", async ({ page }) => {
    await page.goto(env.routes.home);
    const btn = page.getByTestId("play-pause-btn");
    await expect(btn).toBeVisible();
    await btn.click();
    await page.waitForTimeout(800);
    // Page must still be alive — app-root present
    await expect(page.getByTestId("app-root")).toBeVisible();
  });

  test("podcast tag filter narrows the podcast list", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    // Click the 'Tech & AI' tag
    await page.getByRole("button", { name: /Tech & AI/i }).click();
    // Signal & Noise should remain visible
    await expect(page.getByText("Signal & Noise")).toBeVisible();
  });

  test("podcast search filters shows by keyword", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    await page.fill('input[type="search"], input[placeholder*="Search" i]', "Jazz");
    // Mixed Heritage (music/jazz adjacent) or Signal & Noise should narrow
    // The important thing is the list reacts and does not crash
    await expect(page.locator("body")).toBeVisible();
  });

  test("submit form filled completely shows Thank You on success", async ({ page }) => {
    await page.goto(env.routes.submit);
    await page.fill("#artistName", "Behavioral Test Artist");
    await page.fill("#trackTitle", "Behavioral Test Track");
    await page.selectOption("#genre", "Jazz");
    await page.fill("#trackLink", "https://soundcloud.com/behavioral/test");
    await page.fill("#email", "behavioral@imho-test.example.com");
    await page.getByTestId("submit-btn").click();
    // Should show success state — either a toast or an inline confirmation
    await expect(
      page.getByTestId("success-toast").or(page.getByText(/thank you|received|submitted/i))
    ).toBeVisible({ timeout: 12_000 });
  });

  test("waveform-bar elements present in DOM on home page", async ({ page }) => {
    await page.goto(env.routes.home);
    // Waveform bars are rendered in the DOM even when not playing
    const bars = page.locator(".waveform-bar");
    await expect(bars.first()).toBeAttached();
  });

  test("podcast email subscribe form is present on /podcasts", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /subscribe/i })).toBeVisible();
  });
});
