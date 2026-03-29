import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env['E2E_URL'] ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 30_000,
  retries: 1,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
