import { randomBytes } from "node:crypto";

const MAX_TENANT_SLUG_LENGTH = 63;
const FALLBACK_TENANT_SLUG = "tenant";

export const TENANT_SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export interface GenerateTenantSlugInput {
  workspaceName: string;
  email?: string;
}

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

function getEmailSlugCandidate(email?: string): string | null {
  if (!email) {
    return null;
  }

  const [localPart = "", domain = ""] = email.trim().toLowerCase().split("@");
  const domainLabel = domain.split(".")[0] ?? "";
  return normalizeTenantSlug([localPart, domainLabel].filter(Boolean).join("-"));
}

function createFallbackTenantSlug(): string {
  return `${FALLBACK_TENANT_SLUG}-${randomBytes(4).toString("hex")}`;
}

/**
 * Generate a safe tenant slug from a workspace name, email fallback, or random suffix.
 */
export function generateTenantSlug({ workspaceName, email }: GenerateTenantSlugInput): string {
  return (
    normalizeTenantSlug(workspaceName) ?? getEmailSlugCandidate(email) ?? createFallbackTenantSlug()
  );
}
