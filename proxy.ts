import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

import { getClerkCspSources, getClerkPublishableKey, getClerkSecretKey } from './lib/server/auth/clerk-config';
import { TenantAccessError, requireTenant } from './lib/server/tenancy/require-tenant';

const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/features(.*)',
  '/contact(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

const isTenantRoute = createRouteMatcher(['/wraps(.*)', '/admin(.*)']);
const isApiRoute = createRouteMatcher(['/api(.*)']);
const CLERK_CAPTCHA_CSP_SOURCES = ['https://challenges.cloudflare.com'] as const;

function isStripeWebhookRoute(pathname: string): boolean {
  return pathname === '/api/stripe/webhook' || pathname.startsWith('/api/stripe/webhook/');
}

function sanitizeIdentityHeaders(headers: Headers): void {
  const spoofableIdentityHeaders = [
    'x-clerk-user-id',
    'x-clerk-user-email',
    'x-clerk-org-id',
    'x-user-id',
    'x-user-email',
    'x-user-role'
  ];

  for (const header of spoofableIdentityHeaders) {
    headers.delete(header);
  }
}

function readEmailFromClaims(sessionClaims: unknown): string | null {
  if (!sessionClaims || typeof sessionClaims !== 'object' || Array.isArray(sessionClaims)) {
    return null;
  }

  const claims = sessionClaims as Readonly<Record<string, unknown>>;
  const candidateValues = [claims.email, claims.email_address, claims.primary_email_address];

  for (const candidateValue of candidateValues) {
    if (typeof candidateValue === 'string' && candidateValue.trim()) {
      return candidateValue.trim();
    }
  }

  return null;
}

function contentSecurityPolicyForEnvironment(nonce: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const clerkSources = getClerkCspSources();

  const connectSources = ["'self'", 'https://api.stripe.com', ...clerkSources, ...CLERK_CAPTCHA_CSP_SOURCES];
  if (!isProduction) {
    connectSources.push('http://localhost:*', 'https://localhost:*', 'ws://localhost:*', 'wss://localhost:*');
  }

  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    "'unsafe-inline'",
    'https://js.stripe.com',
    ...clerkSources,
    ...CLERK_CAPTCHA_CSP_SOURCES
  ];
  if (!isProduction) {
    scriptSources.push("'unsafe-eval'");
  }

  const frameSources = [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    ...clerkSources,
    ...CLERK_CAPTCHA_CSP_SOURCES
  ];
  const imgSources = ["'self'", 'data:', 'blob:', ...clerkSources];
  const fontSources = ["'self'", 'data:'];

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self' blob:",
    `img-src ${imgSources.join(' ')}`,
    `font-src ${fontSources.join(' ')}`,
    `connect-src ${connectSources.join(' ')}`,
    `frame-src ${frameSources.join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests'
  ].join('; ');
}

function applySecurityHeaders(response: NextResponse, nonce: string): void {
  response.headers.set('content-security-policy', contentSecurityPolicyForEnvironment(nonce));
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), fullscreen=(self)');
  response.headers.set('strict-transport-security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('x-nonce', nonce);
}

function createErrorResponse(error: unknown, nonce: string): NextResponse {
  const response =
    error instanceof TenantAccessError
      ? NextResponse.json(
          {
            error: error.message
          },
          {
            status: error.statusCode
          }
        )
      : NextResponse.json(
          {
            error: 'Unexpected tenant resolution error'
          },
          {
            status: 500
          }
        );

  applySecurityHeaders(response, nonce);
  return response;
}

const clerkPublishableKey = getClerkPublishableKey();
const clerkSecretKey = getClerkSecretKey();

export default clerkMiddleware(
  async (auth, request: NextRequest): Promise<NextResponse> => {
    const nonce = crypto.randomUUID().replace(/-/g, '');
    const pathname = request.nextUrl.pathname;
    const tenantRoute = isTenantRoute(request);
    const apiRoute = isApiRoute(request);
    const webhookRoute = isStripeWebhookRoute(pathname);
    const publicRoute = isPublicRoute(request) || webhookRoute;
    const protectedRoute = (tenantRoute || apiRoute) && !publicRoute;

    if (protectedRoute) {
      await auth.protect();
    }

    const requestHeaders = new Headers(request.headers);
    sanitizeIdentityHeaders(requestHeaders);

    if (protectedRoute) {
      const authState = await auth();
      if (authState.userId) {
        requestHeaders.set('x-clerk-user-id', authState.userId);
        requestHeaders.set(
          'x-clerk-user-email',
          readEmailFromClaims(authState.sessionClaims) ?? `${authState.userId}@clerk.local`
        );
      }

      if (authState.orgId) {
        requestHeaders.set('x-clerk-org-id', authState.orgId);
      } else {
        requestHeaders.delete('x-clerk-org-id');
      }
    }

    if (tenantRoute) {
      try {
        const context = requireTenant({
          headers: {
            host: request.headers.get('host') ?? undefined,
            'x-forwarded-host': request.headers.get('x-forwarded-host') ?? undefined
          }
        });

        requestHeaders.set('x-tenant-id', context.tenant.tenantId);
        requestHeaders.set('x-tenant-slug', context.tenant.slug);

        const response = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        });

        response.headers.set('x-tenant-id', context.tenant.tenantId);
        response.headers.set('x-tenant-slug', context.tenant.slug);
        applySecurityHeaders(response, nonce);
        return response;
      } catch (error) {
        return createErrorResponse(error, nonce);
      }
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
    applySecurityHeaders(response, nonce);
    return response;
  },
  {
    ...(clerkPublishableKey ? { publishableKey: clerkPublishableKey } : {}),
    ...(clerkSecretKey ? { secretKey: clerkSecretKey } : {})
  }
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
