import { headers } from 'next/headers';

import { resolveTenant, type TenantRecord } from './resolve-tenant';

const FALLBACK_TENANT: TenantRecord = {
  tenantId: 'tenant_acme',
  slug: 'acme'
};

export async function getRequestTenant(): Promise<TenantRecord> {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? '';

  const resolvedTenant = resolveTenant({ host });
  return resolvedTenant ?? FALLBACK_TENANT;
}

