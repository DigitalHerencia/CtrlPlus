import { expect, test } from '@playwright/test'
import { expectAuthRedirectWithContext } from './helpers/auth-redirect'

test.describe('Domain Journey Smoke', () => {
    test('public homepage renders', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByText('CTRL+').first()).toBeVisible()
    })

    for (const route of ['/catalog', '/visualizer', '/scheduling', '/billing']) {
        test(`${route} redirects anonymous users to sign-in`, async ({ page }) => {
            await page.goto(route)
            await expectAuthRedirectWithContext(page, route)
        })
    }

    test('catalog not-found route returns not-found UI without runtime crash', async ({ page }) => {
        await page.goto('/catalog/non-existent-wrap')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.locator('body')).not.toContainText('Application error')
    })
})
