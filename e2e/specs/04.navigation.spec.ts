import { test, expect } from "@playwright/test";
import { env } from "../env";

test.describe("Navigation — all routes resolve, links are wired", () => {
  test("/ loads home page with nav visible", async ({ page }) => {
    await page.goto(env.routes.home);
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByTestId("app-root")).toBeVisible();
  });

  test("/podcasts route loads podcast list page", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    await expect(page).toHaveURL(/\/podcasts/);
    await expect(page.getByText(/S.Truth Sessions|Mixed Heritage|Signal/)).toBeVisible();
  });

  test("/submit route loads submission form", async ({ page }) => {
    await page.goto(env.routes.submit);
    await expect(page).toHaveURL(/\/submit/);
    await expect(page.getByTestId("submit-form")).toBeVisible();
  });

  test("/podcasts/pitch route loads pitch-a-show page", async ({ page }) => {
    await page.goto("/podcasts/pitch");
    await expect(page).not.toHaveURL(/404|error/i);
    await expect(page.locator("main, body")).toBeVisible();
  });

  test("/auth/login route loads login form", async ({ page }) => {
    await page.goto(env.routes.login);
    await expect(page).toHaveURL(/login/);
    await expect(page.locator("form")).toBeVisible();
  });

  test("home page 'Browse All Podcasts' link navigates to /podcasts", async ({ page }) => {
    await page.goto(env.routes.home);
    await page.evaluate(() => document.getElementById("podcasts")?.scrollIntoView());
    await page.getByRole("link", { name: /Browse All Podcasts/i }).click();
    await expect(page).toHaveURL(/\/podcasts/);
  });

  test("home page 'Submit Your Track' link navigates to /submit", async ({ page }) => {
    await page.goto(env.routes.home);
    await page.getByRole("link", { name: "Submit Your Track" }).first().click();
    await expect(page).toHaveURL(/\/submit/);
  });

  test("podcast card 'Latest Episode' link navigates to podcast slug page", async ({ page }) => {
    await page.goto(env.routes.home);
    await page.evaluate(() => document.getElementById("podcasts")?.scrollIntoView());
    const link = page.getByRole("link", { name: /Latest Episode/i }).first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/podcasts\//);
  });
});
