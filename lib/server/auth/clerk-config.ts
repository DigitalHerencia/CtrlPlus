const CLERK_PUBLISHABLE_KEY_ENV_KEYS = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_AUTH_CLERK_PUBLISHABLE_KEY'
] as const;

const CLERK_SECRET_KEY_ENV_KEYS = ['CLERK_SECRET_KEY', 'AUTH_CLERK_SECRET_KEY'] as const;

const CLERK_DEFAULT_CSP_SOURCES = [
  'https://*.clerk.accounts.dev',
  'https://clerk-telemetry.com',
  'https://img.clerk.com'
] as const;

function readFirstNonEmptyEnvValue(envKeys: readonly string[]): string | undefined {
  for (const envKey of envKeys) {
    const value = process.env[envKey];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function normalizeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return `${normalized}${'='.repeat(padLength)}`;
}

function decodeClerkFrontendApiHost(publishableKey: string): string | undefined {
  const parts = publishableKey.split('_');
  if (parts.length < 3) {
    return undefined;
  }

  const encodedHost = parts.slice(2).join('_');
  try {
    const decoded = atob(normalizeBase64Url(encodedHost)).trim().replace(/\$$/, '');
    if (!decoded || !/^[a-z0-9.-]+$/i.test(decoded)) {
      return undefined;
    }

    return decoded.toLowerCase();
  } catch {
    return undefined;
  }
}

function normalizeOrigin(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'https:') {
      return undefined;
    }

    return parsed.origin;
  } catch {
    return undefined;
  }
}

export function getClerkPublishableKey(): string | undefined {
  return readFirstNonEmptyEnvValue(CLERK_PUBLISHABLE_KEY_ENV_KEYS);
}

export function getClerkSecretKey(): string | undefined {
  return readFirstNonEmptyEnvValue(CLERK_SECRET_KEY_ENV_KEYS);
}

export function getClerkCspSources(): readonly string[] {
  const sources = new Set<string>(CLERK_DEFAULT_CSP_SOURCES);
  const explicitFrontendApi =
    normalizeOrigin(process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL ?? '') ??
    normalizeOrigin(process.env.NEXT_PUBLIC_AUTH_CLERK_FRONTEND_API_URL ?? '');

  if (explicitFrontendApi) {
    sources.add(explicitFrontendApi);
  }

  const publishableKey = getClerkPublishableKey();
  if (publishableKey) {
    const frontendApiHost = decodeClerkFrontendApiHost(publishableKey);
    if (frontendApiHost) {
      sources.add(`https://${frontendApiHost}`);
    }
  }

  return Array.from(sources);
}
