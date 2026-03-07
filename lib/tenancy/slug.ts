import { randomUUID } from "node:crypto";

const MAX_DNS_LABEL_LENGTH = 63;
const FALLBACK_SLUG_PREFIX = "tenant";

export interface GenerateTenantSlugInput {
  workspaceName?: string | null;
  email?: string | null;
  fallbackPrefix?: string;
}

function sanitizeLabel(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateLabel(input: string, maxLength = MAX_DNS_LABEL_LENGTH): string {
  if (input.length <= maxLength) {
    return input;
  }

  return input.slice(0, maxLength).replace(/-+$/g, "");
}

function buildEmailCandidate(email: string): string {
  const [localPart, domain] = email.toLowerCase().split("@");
  const domainRoot = domain?.split(".")[0] ?? "";
  return `${localPart ?? ""}-${domainRoot}`;
}

function generateShortId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8);
}

export function generateTenantSlug(input: GenerateTenantSlugInput): string {
  const fallbackPrefix = sanitizeLabel(input.fallbackPrefix ?? FALLBACK_SLUG_PREFIX) || FALLBACK_SLUG_PREFIX;

  const candidates = [
    input.workspaceName ?? "",
    input.email ? buildEmailCandidate(input.email) : "",
  ];

  for (const candidate of candidates) {
    const sanitized = truncateLabel(sanitizeLabel(candidate));
    if (sanitized.length > 0) {
      return sanitized;
    }
  }

  return truncateLabel(`${fallbackPrefix}-${generateShortId()}`);
}
