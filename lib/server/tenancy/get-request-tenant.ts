import { headers } from 'next/headers';

import { requireTenant, type TenantContext } from './require-tenant';

export async function getRequestTenant(): Promise<TenantContext['tenant']> {
  const requestHeaders = await headers();

  const context = requireTenant({
    headers: {
      host: requestHeaders.get('host') ?? undefined,
      'x-forwarded-host': requestHeaders.get('x-forwarded-host') ?? undefined
    }
  });

  return context.tenant;
}

