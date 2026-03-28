import { expect, test } from '@playwright/test'

import { expectAuthRedirectWithContext } from './helpers/auth-redirect'

const settingsEmail = process.env.E2E_SETTINGS_EMAIL?.trim()
const settingsPassword = process.env.E2E_SETTINGS_PASSWORD?.trim()

test.describe('Settings route', () => {
    test('redirects unauthenticated users to sign-in', async ({ page }) => {
        await page.goto('/settings')
        await expectAuthRedirectWithContext(page, '/settings')
    })

    test.skip(
        !settingsEmail || !settingsPassword,
        'Set E2E_SETTINGS_EMAIL and E2E_SETTINGS_PASSWORD to run the authenticated settings flow.'
    )

    test('authenticated user can update settings and see persisted values after reload', async ({
        page,
    }) => {
        await page.goto('/sign-in?redirect_url=/settings')
        await page.getByLabel('Email').fill(settingsEmail!)
        await page.getByLabel('Password').fill(settingsPassword!)
        await page.getByRole('button', { name: 'Login' }).click()

        await page.waitForURL('**/settings')

        const timezoneInput = page.getByPlaceholder('America/Los_Angeles')
        await expect(timezoneInput).toBeVisible()

        await timezoneInput.fill('America/New_York')
        await page.getByLabel('SMS').click()
        await page.getByLabel('Marketing updates').click()
        await page.getByRole('button', { name: 'Save settings' }).click()

        await expect(page.getByText('Settings saved successfully.')).toBeVisible()

        await page.reload()

        await expect(page.getByPlaceholder('America/Los_Angeles')).toHaveValue('America/New_York')
        await expect(page.getByLabel('SMS')).toBeChecked()
        await expect(page.getByLabel('Marketing updates')).toBeChecked()
    })
})
