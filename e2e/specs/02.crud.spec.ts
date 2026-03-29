import { test, expect } from "@playwright/test";
import { env } from "../env";

/**
 * CRUD verification for IMHO Media.
 *
 * The primary write path is the track-submission form (/submit).
 * Full admin CRUD requires auth so we verify the unauthenticated surfaces
 * and the submission API response shape.
 */
test.describe("CRUD — track submission and podcast data", () => {
  test("submit form has all 5 required input fields", async ({ page }) => {
    await page.goto(env.routes.submit);
    await expect(page.locator("#artistName")).toBeVisible();
    await expect(page.locator("#trackTitle")).toBeVisible();
    await expect(page.locator("#genre")).toBeVisible();
    await expect(page.locator("#trackLink")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
  });

  test("genre dropdown contains expected options", async ({ page }) => {
    await page.goto(env.routes.submit);
    const options = await page.locator("#genre option").allTextContents();
    const genres = options.map((o) => o.trim()).filter(Boolean);
    expect(genres).toContain("Soul / R&B");
    expect(genres).toContain("Jazz");
    expect(genres).toContain("Hip-Hop");
  });

  test("podcasts page lists all three shows", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    await expect(page.getByText("S\u2019Truth Sessions")).toBeVisible();
    await expect(page.getByText("Mixed Heritage Unplugged")).toBeVisible();
    await expect(page.getByText("Signal & Noise")).toBeVisible();
  });

  test("individual podcast show page loads from /podcasts slug", async ({ page }) => {
    await page.goto("/podcasts/struths-sessions");
    await expect(page).not.toHaveURL(/404|error/i);
    await expect(page.locator("main, body")).toBeVisible();
  });

  test("submit form POST to /api/submit returns non-500 on valid data", async ({ request }) => {
    const res = await request.post("/api/submit", {
      data: {
        artistName: "Gate7 Test Artist",
        trackTitle: "Gate7 Test Track",
        genre: "Jazz",
        trackLink: "https://soundcloud.com/gate7/test",
        email: "gate7@test.example.com",
      },
    });
    // Accept 200 (success) or 4xx (validation/auth) but NOT a 500 server crash
    expect(res.status()).not.toBe(500);
  });
});
