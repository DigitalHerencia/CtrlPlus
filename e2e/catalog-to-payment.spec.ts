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

    test('catalog browse route preserves search context when redirecting', async ({ page }) => {
        const route = '/catalog?query=matte&categoryId=cat-1&sortBy=price&sortOrder=asc&page=2&pageSize=12'

        await page.goto(route)
        await expectAuthRedirectWithContext(page, route)
    })

    test('catalog detail route preserves path context when redirecting', async ({ page }) => {
        const route = '/catalog/non-existent-wrap?source=e2e'

        await page.goto(route)
        await expectAuthRedirectWithContext(page, route)
    })

    test('catalog manager route preserves path context when redirecting', async ({ page }) => {
        const route = '/catalog/manage?panel=wraps'

        await page.goto(route)
        await expectAuthRedirectWithContext(page, route)
    })

    test('catalog detail route does not leak runtime errors on unknown wrap ids', async ({
        page,
    }) => {
        await page.goto('/catalog/non-existent-wrap')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.locator('body')).not.toContainText('Application error')
    })
})
