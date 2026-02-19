export interface TenantRecord {
  readonly tenantId: string;
  readonly slug: string;
  readonly clerkOrgId: string;
}

export interface ResolveTenantInput {
  readonly host: string;
}

const KNOWN_TENANTS: readonly TenantRecord[] = [
  {
    tenantId: 'tenant_acme',
    slug: 'acme',
    clerkOrgId: 'org_acme'
  },
  {
    tenantId: 'tenant_beta',
    slug: 'beta',
    clerkOrgId: 'org_beta'
  }
];

function normalizeHost(host: string): string {
  const normalizedHost = host.trim().toLowerCase();
  const separatorIndex = normalizedHost.indexOf(':');

  if (separatorIndex === -1) {
    return normalizedHost;
  }

  return normalizedHost.slice(0, separatorIndex);
}

function resolveSubdomain(host: string): string | null {
  const normalizedHost = normalizeHost(host);

  if (!normalizedHost) {
    return null;
  }

  if (normalizedHost === 'localhost') {
    return null;
  }

  if (normalizedHost.endsWith('.localhost')) {
    const subdomain = normalizedHost.replace(/\.localhost$/, '');
    return subdomain || null;
  }

  const hostParts = normalizedHost.split('.');
  if (hostParts.length < 3) {
    return null;
  }

  return hostParts[0] || null;
}

export function resolveTenant(input: ResolveTenantInput): TenantRecord | null {
  const subdomain = resolveSubdomain(input.host);

  if (!subdomain) {
    return null;
  }

  const tenant = KNOWN_TENANTS.find((candidate) => candidate.slug === subdomain);
  return tenant ?? null;
}
