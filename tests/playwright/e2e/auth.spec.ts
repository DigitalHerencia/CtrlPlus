/**
 * Authentication E2E tests.
 *
 * Covers:
 *  - Public pages are accessible without authentication
 *  - Protected routes redirect unauthenticated users to sign-in
 *  - Sign-in and sign-up pages render correctly
 */

import { expect, test } from './helpers/test'
import { expectAuthRedirectWithContext } from './helpers/auth-redirect'

// ─── Public page accessibility ────────────────────────────────────────────────

test.describe('Public pages', () => {
    test('homepage loads and shows brand name', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveTitle(/CTRL\+/i)
        // The hero / header renders the platform name
        await expect(page.getByText('CTRL+').first()).toBeVisible()
    })

    test('homepage has navigation links to sign-in and sign-up', async ({ page }) => {
        await page.goto('/')
        // At least one link should point to the sign-in or sign-up page
        const authLinks = page.locator('a[href*="sign"]')
        await expect(authLinks.first()).toBeVisible()
    })
})

// ─── Sign-in page ─────────────────────────────────────────────────────────────

test.describe('Sign-in page', () => {
    test('renders the Clerk sign-in component', async ({ page }) => {
        await page.goto('/sign-in')
        await page.waitForLoadState('domcontentloaded')
        // Clerk renders a sign-in form with an email/identifier input
        // We check that the page loads without a server error
        await expect(page.locator('body')).not.toContainText('500')
        await expect(page.locator('body')).not.toContainText('Application error')
    })

    test('page title contains the platform name', async ({ page }) => {
        await page.goto('/sign-in')
        await expect(page).toHaveTitle(/CTRL\+/i)
    })
})

// ─── Sign-up page ─────────────────────────────────────────────────────────────

test.describe('Sign-up page', () => {
    test('renders the Clerk sign-up component', async ({ page }) => {
        await page.goto('/sign-up')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.locator('body')).not.toContainText('500')
        await expect(page.locator('body')).not.toContainText('Application error')
    })
})

// ─── Protected route redirection ─────────────────────────────────────────────

test.describe('Protected routes', () => {
    const protectedRoutes = [
        '/catalog',
        '/visualizer',
        '/scheduling',
        '/scheduling/book',
        '/scheduling/bookings',
        '/billing',
        '/admin',
    ]

    for (const route of protectedRoutes) {
        test(`${route} redirects unauthenticated users to sign-in`, async ({ page }) => {
            await page.goto(route)
            await expectAuthRedirectWithContext(page, route)
        })
    }

    test('preserves requested route context for redirects with query strings', async ({ page }) => {
        const routeWithQuery = '/catalog?source=e2e&branch_context=1'
        await page.goto(routeWithQuery)
        await expectAuthRedirectWithContext(page, routeWithQuery)
    })
})
