import { test as base } from '@playwright/test'

// Example fixture extension — adapt to your project's auth helper
type Credentials = { email: string; password: string }

export const test = base.extend<{ credentials: Credentials }>({
    credentials: async ({}, run) => {
        await run({
            email: process.env.E2E_SETTINGS_EMAIL ?? '',
            password: process.env.E2E_SETTINGS_PASSWORD ?? '',
        })
    },
})

export const expect = test.expect
