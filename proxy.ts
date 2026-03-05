/**
 * Proxy for Route Protection
 *
 * Uses Clerk middleware to protect routes and handle authentication.
 * Public routes: /, /about, /features, /contact, /sign-in, /sign-up, /api/webhooks
 * Protected routes: /catalog, /visualizer, /scheduling, /billing, /admin
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/features(.*)",
  "/contact(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)", // Webhooks must be public (Clerk/Stripe sign requests)
]);

// Define auth routes (redirect if already signed in)
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Get the pathname
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(req) && userId) {
    const redirectUrl = new URL("/catalog", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Protect all other routes - require authentication
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated, allow request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
