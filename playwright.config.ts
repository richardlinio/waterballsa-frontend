import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E 測試設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Add extra HTTP headers if needed for backend communication
    extraHTTPHeaders: {
      'Accept-Language': 'zh-TW',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'echo "Using existing Docker services"',
    url: 'http://localhost',
    reuseExistingServer: true,
    // Timeout for waiting for the server to start (default: 60s)
    timeout: 120 * 1000,
  },
})
