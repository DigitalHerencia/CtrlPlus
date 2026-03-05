import { headers } from "next/headers";

export interface TenantContext {
  tenantId: string;
  subdomain: string;
}

/**
 * Resolves the current tenant from the request host header.
 * In production the subdomain (e.g. "acme" from "acme.ctrlplus.app") is the
 * tenant identifier.  Locally (localhost / 127.0.0.1) we fall back to an
 * environment variable so development still works without a custom host.
 *
 * The tenantId is NEVER accepted from the client (URL params / request body).
 */
export async function resolveTenant(): Promise<TenantContext> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  // Strip port suffix for local development
  const hostname = host.split(":")[0];

  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";

  if (isLocalhost) {
    const devTenantId = process.env.DEV_TENANT_ID ?? "dev-tenant";
    return { tenantId: devTenantId, subdomain: devTenantId };
  }

  // Production: subdomain is the first segment of the host
  // e.g. "acme.ctrlplus.app" → subdomain = "acme"
  // A valid tenant host must have at least 3 parts (subdomain.domain.tld)
  const parts = hostname.split(".");
  if (parts.length < 3) {
    throw new Error(
      `Unable to resolve tenant: host "${hostname}" has no subdomain`
    );
  }
  const subdomain = parts[0];

  if (!subdomain) {
    throw new Error("Unable to resolve tenant: missing subdomain");
  }

  return { tenantId: subdomain, subdomain };
}
