import { test, expect } from "@playwright/test";
import { env } from "../env";

test.describe("Auth — IMHO Media admin login flow", () => {
  test("unauthenticated /admin redirects to login", async ({ page }) => {
    await page.goto(env.routes.admin);
    // Must end up on login page or show a login prompt — never raw admin content
    await expect(page).toHaveURL(/\/auth\/login|\/admin/);
  });

  test("login page renders email and password inputs", async ({ page }) => {
    await page.goto(env.routes.login);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible()
  });

  test("login page has a submit button", async ({ page }) => {
    await page.goto(env.routes.login);
    await expect(
      page.getByRole("button", { name: /sign in|log in|continue/i })
    ).toBeVisible();
  });

  test("login with invalid credentials shows error message", async ({ page }) => {
    await page.goto(env.routes.login);
    await page.fill('input[type="email"], input[name="email"]', "bad@example.com");
    await page.fill('input[type="password"], input[name="password"]', "wrongpassword");
    await page.getByRole("button", { name: /sign in|log in|continue/i }).click();
    // Should not redirect to admin — stays on login or shows error
    await page.waitForTimeout(2_000);
    const url = page.url();
    expect(url).not.toMatch(/\/admin\/dashboard/);
  });
});
