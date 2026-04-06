import { expect, test } from './helpers/test'
import { expectAuthRedirectWithContext } from './helpers/auth-redirect'

test.describe('Clerk Surface Smoke', () => {
    test('sign-in page loads without server error', async ({ page }) => {
        await page.goto('/sign-in')
        await page.waitForLoadState('domcontentloaded')
        await expect(page).toHaveURL(/\/sign-in/)
        await expect(page.locator('body')).toContainText(/sign in|continue/i)
        await expect(page.locator('body')).not.toContainText('Application error')
        await expect(page.locator('body')).not.toContainText('500')
    })

    test('sign-up page loads without server error', async ({ page }) => {
        await page.goto('/sign-up')
        await page.waitForLoadState('domcontentloaded')
        await expect(page).toHaveURL(/\/sign-up/)
        await expect(page.locator('body')).toContainText(/create your account|sign up|continue/i)
        await expect(page.locator('body')).not.toContainText('Application error')
        await expect(page.locator('body')).not.toContainText('500')
    })

    test('protected route redirects to sign-in with return context', async ({ page }) => {
        const route = '/billing?invoice=inv_123'

        await page.goto(route)
        await expectAuthRedirectWithContext(page, route)
    })
})
