import { defineConfig, devices } from '@playwright/test'

/**
 * BASE_URL allows overriding the target server (e.g. a Vercel preview deployment).
 * When not set, playwright.config.ts will start a local Next.js dev server instead.
 */
const explicitBaseUrl = process.env.BASE_URL?.trim()
const BASE_URL = explicitBaseUrl || 'http://localhost:3000'

/**
 * By default we boot a local Next.js server for E2E runs.
 * Set PLAYWRIGHT_SKIP_WEBSERVER=true only when targeting a pre-existing remote deployment.
 */
const shouldSkipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === 'true'

const webServer = shouldSkipWebServer
    ? undefined
    : {
          command: 'pnpm dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
              NODE_ENV: 'test',
          },
      }

export default defineConfig({
    // New target test folder for Playwright E2E tests
    testDir: './tests/playwright/e2e',
    /* Maximum time one test can run */
    timeout: 30_000,
    /* Fail CI fast on first failure */
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI
        ? [
              ['github'],
              [
                  'html',
                  {
                      outputFolder: 'playwright-report',
                      open: 'never',
                  },
              ],
          ]
        : 'list',

    use: {
        baseURL: BASE_URL,
        /* Collect trace on first retry */
        trace: 'on-first-retry',
        /* Screenshot on failure */
        screenshot: 'only-on-failure',
        /* Viewport */
        viewport: { width: 1280, height: 720 },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        /* Mobile viewports */
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    ...(webServer ? { webServer } : {}),
})
