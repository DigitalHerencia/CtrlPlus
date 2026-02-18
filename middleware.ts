import { randomUUID } from 'node:crypto';

import { NextResponse, type NextRequest } from 'next/server';

import { TenantAccessError, requireTenant } from './lib/server/tenancy/require-tenant';

function contentSecurityPolicyForEnvironment(nonce: string): string {
  const isProduction = process.env.NODE_ENV === 'production';

  const connectSources = ["'self'", 'https://api.stripe.com'];
  if (!isProduction) {
    connectSources.push('http://localhost:*', 'https://localhost:*', 'ws://localhost:*', 'wss://localhost:*');
  }

  const scriptSources = ["'self'", `'nonce-${nonce}'`, 'https://js.stripe.com'];
  if (!isProduction) {
    scriptSources.push("'unsafe-eval'");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(' ')}`,
    "frame-src https://js.stripe.com https://hooks.stripe.com",
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

export function middleware(request: NextRequest): NextResponse {
  const nonce = randomUUID().replace(/-/g, '');

  try {
    const context = requireTenant({
      headers: {
        host: request.headers.get('host') ?? undefined,
        'x-forwarded-host': request.headers.get('x-forwarded-host') ?? undefined,
        'x-tenant-id': request.headers.get('x-tenant-id') ?? undefined
      }
    });

    const response = NextResponse.next();
    response.headers.set('x-tenant-id', context.tenant.tenantId);
    response.headers.set('x-tenant-slug', context.tenant.slug);

    applySecurityHeaders(response, nonce);
    return response;
  } catch (error) {
    return createErrorResponse(error, nonce);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
