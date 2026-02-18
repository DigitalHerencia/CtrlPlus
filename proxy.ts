import { NextResponse, type NextRequest } from 'next/server';

import { TenantAccessError, requireTenant } from './lib/server/tenancy/require-tenant';

function createErrorResponse(error: unknown): NextResponse {
  if (error instanceof TenantAccessError) {
    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: error.statusCode
      }
    );
  }

  return NextResponse.json(
    {
      error: 'Unexpected tenant resolution error'
    },
    {
      status: 500
    }
  );
}

export function proxy(request: NextRequest): NextResponse {
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
    return response;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
