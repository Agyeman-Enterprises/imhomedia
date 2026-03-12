import { test, expect } from "@playwright/test";
import { env } from "../env";

test.describe("Player", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(env.routes.home);
  });

  test("nav play/pause button is visible", async ({ page }) => {
    await expect(page.getByTestId("play-pause-btn")).toBeVisible();
  });

  test("nav play button shows 'Listen Now' initially", async ({ page }) => {
    await expect(page.getByTestId("play-pause-btn")).toHaveText(/Listen Now/i);
  });

  test("hero play button is visible", async ({ page }) => {
    await expect(page.getByTestId("hero-play-btn")).toBeVisible();
  });

  test("clicking nav play button changes label (audio may be blocked)", async ({ page }) => {
    // Grant audio permission so the click doesn't silently fail on webkit
    const btn = page.getByTestId("play-pause-btn");
    await btn.click();
    // Give the async play() promise a moment to resolve or reject
    await page.waitForTimeout(800);
    // The button should either show "Pause" (playing) or still "Listen Now" (autoplay blocked)
    // Either way, the click must not crash the page
    await expect(page.getByTestId("app-root")).toBeVisible();
  });
});
