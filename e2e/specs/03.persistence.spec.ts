import { test, expect } from "@playwright/test";
import { env } from "../env";

/**
 * Persistence — verify that static data and page state survive navigation
 * and hard refresh. For IMHO Media the core persistent data is:
 *   1. Podcast catalog (always loads from data layer, not memory)
 *   2. Genre list (rendered from server data)
 *   3. Stream URL remains in the page after navigation
 */
test.describe("Persistence — data survives navigation and refresh", () => {
  test("podcasts page renders all shows after hard reload", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    await expect(page.getByText("S\u2019Truth Sessions")).toBeVisible();

    // Hard reload
    await page.reload();

    await expect(page.getByText("S\u2019Truth Sessions")).toBeVisible();
    await expect(page.getByText("Mixed Heritage Unplugged")).toBeVisible();
    await expect(page.getByText("Signal & Noise")).toBeVisible();
  });

  test("home page stream player state resets after navigation then return", async ({ page }) => {
    await page.goto(env.routes.home);
    await expect(page.getByTestId("hero-play-btn")).toBeVisible();

    // Navigate away
    await page.goto(env.routes.podcasts);
    await expect(page).toHaveURL(/\/podcasts/);

    // Navigate back
    await page.goto(env.routes.home);
    // Player should be back in initial (not playing) state — not crash
    await expect(page.getByTestId("app-root")).toBeVisible();
    await expect(page.getByTestId("play-pause-btn")).toBeVisible();
  });

  test("genre list on home page persists after page reload", async ({ page }) => {
    await page.goto(env.routes.home);
    // Scroll to genres section
    await page.evaluate(() => document.getElementById("genres")?.scrollIntoView());
    await expect(page.getByText("Soul / R&B")).toBeVisible();

    await page.reload();

    await page.evaluate(() => document.getElementById("genres")?.scrollIntoView());
    await expect(page.getByText("Soul / R&B")).toBeVisible();
    await expect(page.getByText("Jazz")).toBeVisible();
  });

  test("submit page form fields are empty on each fresh load (no stale state)", async ({ page }) => {
    await page.goto(env.routes.submit);
    const artistName = await page.locator("#artistName").inputValue();
    expect(artistName).toBe("");

    await page.goto(env.routes.home);
    await page.goto(env.routes.submit);
    const artistNameAfterNav = await page.locator("#artistName").inputValue();
    expect(artistNameAfterNav).toBe("");
  });
});
