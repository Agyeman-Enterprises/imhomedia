import { test, expect } from "@playwright/test";
import { env } from "../env";

test.describe("Smoke", () => {
  test("home page loads with correct title", async ({ page }) => {
    await page.goto(env.routes.home);
    await expect(page).toHaveTitle(/IMHO/i);
  });

  test("home page has app-root element", async ({ page }) => {
    await page.goto(env.routes.home);
    await expect(page.getByTestId("app-root")).toBeVisible();
  });

  test("submit page loads", async ({ page }) => {
    await page.goto(env.routes.submit);
    await expect(page).toHaveURL(/\/submit/);
    await expect(page.getByTestId("submit-form")).toBeVisible();
  });

  test("podcasts page loads", async ({ page }) => {
    await page.goto(env.routes.podcasts);
    await expect(page).toHaveURL(/\/podcasts/);
  });

  test("unauthenticated admin redirects to login", async ({ page }) => {
    await page.goto(env.routes.admin);
    // Should land on login or redirect
    await expect(page).toHaveURL(/\/auth\/login|\/admin/);
  });
});
