# Testing guide

This document explains how to run and debug the project's test suites (unit and end-to-end), environment variables used by tests, and common troubleshooting steps.

## Test layout

- Unit tests (Vitest): `tests/vitest/unit/**`
- Playwright E2E tests: `tests/playwright/e2e/**`
- Global Vitest setup: `tests/vitest/setup/vitest.setup.ts`
- Playwright config: `playwright.config.ts`
- Vitest config: `vitest.config.ts`

## Run unit tests (Vitest)

Run all unit tests once:

```bash
pnpm test:unit
```

Run Vitest in watch mode during development:

```bash
pnpm test:watch
```

There is a small CI-friendly wrapper that runs typecheck then unit tests:

```bash
pnpm test:ci
```

Notes:
- The repository uses `tests/vitest/setup/vitest.setup.ts` to apply global mocks for server-only modules (for example, `server-only` and `@clerk/nextjs/server`). If you add server-side helpers, ensure the setup mocks still cover imports used by tests.

## Run end-to-end tests (Playwright)

Playwright is configured to start a local Next.js dev server automatically (see `playwright.config.ts` webServer). To run the full E2E suite:

```bash
pnpm test:e2e
```

This runs `playwright install chromium` (pretest) and then `playwright test`.

To run E2E tests against an existing deployment or a remote preview (skip starting the local dev server):

```bash
# Unix / macOS
export PLAYWRIGHT_SKIP_WEBSERVER=true
export BASE_URL=https://my-preview.example
pnpm test:e2e

# PowerShell
$env:PLAYWRIGHT_SKIP_WEBSERVER = 'true'
$env:BASE_URL = 'https://my-preview.example'
pnpm test:e2e
```

Run a single Playwright spec or project:

```bash
# single file
pnpm exec playwright test tests/playwright/e2e/auth.spec.ts

# single project (chromium)
pnpm exec playwright test -p chromium
```

## Required environment variables for E2E

The Playwright auth fixture reads these environment variables for some tests (stored in `tests/playwright/fixtures/auth.fixture.ts`):

- `E2E_SETTINGS_EMAIL` — test account email used by settings/auth tests
- `E2E_SETTINGS_PASSWORD` — test account password

Set these in your shell or in `.env.local` when running tests locally.

## Common issues & troubleshooting

- If importing server-only helpers throws during unit tests, confirm `tests/vitest/setup/vitest.setup.ts` is loaded and contains the mocks for `server-only` and server-only provider helpers (e.g., `@clerk/nextjs/server`).
- ESLint `react-hooks/rules-of-hooks` may flag Playwright fixtures if the fixture callback parameter is named `use`. When creating Playwright fixtures, prefer `run`, `apply`, or `exec` as the parameter name to avoid false positives.
- If Playwright reports the server didn't start on `http://localhost:3000`, either start the dev server manually (`pnpm dev`) or set `PLAYWRIGHT_SKIP_WEBSERVER=true` and `BASE_URL` to a reachable URL.

## CI recommendations (no changes applied here)

Recommended CI steps (example):

```bash
pnpm typecheck
pnpm test:unit
# optionally run e2e in a separate job with a deployed preview URL
pnpm test:e2e
```

## Where to add new tests

- Unit tests: `tests/vitest/unit/**` (use `@/` module alias in imports when the source code uses it)
- E2E tests: `tests/playwright/e2e/**`
- Fixtures: `tests/playwright/fixtures/**`

## Contacts / ownership

If something in the test infra is unclear, talk to the team member who worked on the test migration; the global Vitest setup and the Playwright fixtures are the two best places to start when changing tests.
