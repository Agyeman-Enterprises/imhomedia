import { test, expect } from "@playwright/test";
import { env } from "../env";

/** Console errors that are known-safe to ignore */
const IGNORED_PATTERNS = [
  // Browser autoplay policy blocks audio — not an app error
  /play\(\) request was interrupted/i,
  /NotAllowedError/i,
  // Supabase placeholder creds produce a fetch error in dev — expected
  /supabase/i,
  /placeholder/i,
  // Next.js dev-mode HMR noise
  /webpack/i,
  /Fast Refresh/i,
];

function isIgnored(msg: string): boolean {
  return IGNORED_PATTERNS.some((p) => p.test(msg));
}

const PAGES = [
  { name: "home", route: env.routes.home },
  { name: "submit", route: env.routes.submit },
  { name: "podcasts", route: env.routes.podcasts },
  { name: "login", route: env.routes.login },
];

for (const { name, route } of PAGES) {
  test(`no unexpected console errors on ${name} page`, async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error" && !isIgnored(msg.text())) {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      if (!isIgnored(err.message)) {
        errors.push(err.message);
      }
    });

    await page.goto(route);
    // Brief settle time to catch async errors on mount
    await page.waitForTimeout(1_500);

    expect(errors, `Unexpected console errors on ${name}: ${errors.join(" | ")}`).toHaveLength(0);
  });
}
