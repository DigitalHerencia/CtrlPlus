const MAX_TENANT_SLUG_LENGTH = 63;
const FALLBACK_TENANT_SLUG = "tenant";

export const TENANT_SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Normalize arbitrary input into a valid tenant slug candidate.
 * Returns null when a valid slug cannot be produced.
 */
export function normalizeTenantSlug(input: string): string | null {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_TENANT_SLUG_LENGTH)
    .replace(/-+$/g, "");

  if (!normalized) {
    return null;
  }

  return TENANT_SLUG_REGEX.test(normalized) ? normalized : null;
}

/**
 * Deterministically generate a safe tenant slug from a seed.
 */
export function generateTenantSlug(seed: string): string {
  return normalizeTenantSlug(seed) ?? FALLBACK_TENANT_SLUG;
}
