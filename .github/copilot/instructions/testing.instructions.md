---
description: 'Project-wide testing instructions: where tests live, how to run them, and rules for adding tests and fixtures.'
applyTo: 'tests/**,tests/vitest/**,tests/playwright/**,playwright.config.ts,vitest.config.ts,package.json'
---

# Testing instructions (developer guidance)

These instructions explain repository conventions for tests, fixtures, and recommended patterns when adding or migrating tests.

## Locations & naming

- Unit tests (Vitest): `tests/vitest/unit/**` — keep server-only unit tests here and use the global Vitest setup for mocks.
- E2E tests (Playwright): `tests/playwright/e2e/**` — browser-driven scenarios that exercise the app from a user's perspective.
- Playwright fixtures: `tests/playwright/fixtures/**`

Test file naming: prefer `.spec.ts`, `.spec.tsx`, `.test.ts`, or `.test.tsx` to make intent clear.

## Global mocks and setup

- Use `tests/vitest/setup/vitest.setup.ts` for repository-wide mocks required by unit tests (for example, mocking `server-only` and `@clerk/nextjs/server`). Keep these mocks minimal and explicit.
- When your unit test needs more targeted mocks (e.g., a billing helper), mock the same module specifier the implementation uses (use the `@/` alias if the implementation imports `@/lib/...`).

## Playwright fixtures & ESLint quirk

- Playwright fixtures extend `test` and accept a callback parameter that is commonly named `use` in examples. In this repo ESLint's `react-hooks/rules-of-hooks` can flag `use` in fixture callbacks as an invalid Hook call. To avoid false positives:
  - Do not name fixture callback parameter `use` when the fixture file is in the same file as test helpers.
  - Prefer `run`, `apply`, or `exec` for the callback parameter. Example:

```ts
export const test = base.extend<{ credentials: Credentials }>({
  credentials: async ({}, run) => {
    await run({ /* ... */ })
  }
})
```

## Playwright webserver behavior

- By default Playwright's config starts `pnpm dev` for local runs. To test against a remote preview set `PLAYWRIGHT_SKIP_WEBSERVER=true` and `BASE_URL` to the target URL.

## Adding new tests

1. Add unit tests to `tests/vitest/unit` whenever the code under test is a small isolated helper, fetcher, action, or route handler.
2. Add Playwright tests to `tests/playwright/e2e` when you need to validate route composition, auth redirects, or user flows across pages.
3. Use module alias `@/` in tests to match application code imports (this avoids fragile relative paths after moving tests).

## Recommended CI pattern (guidance only)

- Separate jobs for typecheck, unit tests, and e2e tests. Use a deployed preview for e2e to avoid starting a dev server in CI, or start the app server then run Playwright.

## Troubleshooting

- If unit tests fail due to server-only imports, confirm the Vitest setup file still mocks `server-only` and server-only providers.
- If Playwright tests fail due to authentication or missing test accounts, confirm the E2E environment variables `E2E_SETTINGS_EMAIL` and `E2E_SETTINGS_PASSWORD` are set for the test run.

## Keep tests fast and deterministic

- Favor unit tests for business logic and small helpers.
- Keep E2E tests as thin smoke-journeys that ensure the critical user flows work end-to-end; avoid duplicating broad unit coverage in E2E runs.
