import { defineConfig, devices } from "@playwright/test";

/**
 * BASE_URL allows overriding the target server (e.g. a Vercel preview deployment).
 * When not set, playwright.config.ts will start a local Next.js dev server instead.
 */
const explicitBaseUrl = process.env.BASE_URL?.trim();
const BASE_URL = explicitBaseUrl || "http://localhost:3000";
const isRemoteBaseUrl =
  !!explicitBaseUrl && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(explicitBaseUrl);

/**
 * Only boot a local Next.js server when BASE_URL is not pointing at a remote URL.
 * When BASE_URL is provided (e.g. for Vercel preview runs), skip the webServer.
 */
const shouldStartWebServer = process.env.CI === "true" || !isRemoteBaseUrl;

const webServer = shouldStartWebServer
  ? {
      command: "pnpm dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NODE_ENV: "test",
      },
    }
  : undefined;

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["**/fixtures/**"],
  /* Maximum time one test can run */
  timeout: 30_000,
  /* Fail CI fast on first failure */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["github"],
        [
          "html",
          {
            outputFolder: "playwright-report",
            open: "never",
          },
        ],
      ]
    : "list",

  use: {
    baseURL: BASE_URL,
    /* Collect trace on first retry */
    trace: "on-first-retry",
    /* Screenshot on failure */
    screenshot: "only-on-failure",
    /* Viewport */
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    /* Mobile viewports */
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  ...(webServer ? { webServer } : {}),
});
