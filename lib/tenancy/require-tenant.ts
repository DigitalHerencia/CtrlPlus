import { resolveTenant, type TenantRecord } from './resolve-tenant';

export class TenantAccessError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'TenantAccessError';
    this.statusCode = statusCode;
  }
}

export interface RequireTenantInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
}

export interface TenantContext {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenant: TenantRecord;
}

function normalizeHeaderName(headerName: string): string {
  return headerName.trim().toLowerCase();
}

function resolveHostFromHeaders(headers: Readonly<Record<string, string | undefined>>): string | null {
  const host = Object.entries(headers).find(([headerName]) => normalizeHeaderName(headerName) === 'host')?.[1]
    ?? Object.entries(headers).find(([headerName]) => normalizeHeaderName(headerName) === 'x-forwarded-host')?.[1]
    ?? null;

  if (!host || !host.trim()) {
    return null;
  }

  return host;
}

export function requireTenant(input: RequireTenantInput): TenantContext {
  const host = resolveHostFromHeaders(input.headers);

  if (!host) {
    throw new TenantAccessError('Tenant host was not provided', 404);
  }

  const tenant = resolveTenant({ host });
  if (!tenant) {
    throw new TenantAccessError('Tenant not found', 404);
  }

  return {
    tenantId: tenant.tenantId,
    tenantSlug: tenant.slug,
    tenant
  };
}
