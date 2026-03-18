/**
 * Proxy for Route Protection
 *
 * Uses Clerk middleware to protect routes and handle authentication.
 * Public routes: /, /about, /features, /contact, /sign-in, /sign-up,
 * /api/clerk/webhook-handler, /api/stripe/webhook
 * Protected routes: /catalog, /visualizer, /scheduling, /billing, /settings, /admin, /platform
 *
 * Auth routes are force-redirected for signed-in users to `/catalog`.
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
    '/',
    '/about(.*)',
    '/features(.*)',
    '/contact(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/clerk/webhook(.*)', // Clerk webhook must be public
    '/api/clerk/webhook-handler(.*)', // Clerk webhook-handler must be public
    '/api/stripe/webhook(.*)', // Stripe webhook must be public
])

// Define auth routes (redirect if already signed in)
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    // Get the pathname
    const { pathname, search } = req.nextUrl

    // Redirect authenticated users away from auth pages.
    if (isAuthRoute(req) && userId) {
        const redirectUrl = new URL('/catalog', req.url)
        return NextResponse.redirect(redirectUrl)
    }

    // Allow public routes
    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    // Protect all other routes - require authentication
    if (!userId) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', `${pathname}${search}`)
        return NextResponse.redirect(signInUrl)
    }

    // User is authenticated, allow request
    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
