import { headers } from 'next/headers';

import { requireTenant, type TenantContext } from './require-tenant';

export async function getRequestTenant(): Promise<TenantContext> {
  const requestHeaders = await headers();

  return requireTenant({
    headers: {
      host: requestHeaders.get('host') ?? undefined,
      'x-forwarded-host': requestHeaders.get('x-forwarded-host') ?? undefined
    }
  });
}
