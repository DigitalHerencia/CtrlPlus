import { auth, currentUser } from "@clerk/nextjs/server";

export interface SessionUser {
  id: string;
  clerkUserId: string;
  email: string;
}

export interface Session {
  user: SessionUser | null;
  tenantId: string;
}

/**
 * Resolves the current authenticated user and tenant from the Clerk session.
 * The tenantId is derived server-side from the request host, never from client input.
 *
 * @returns Session object with user (or null) and tenantId
 */
export async function getSession(): Promise<Session> {
  const { userId } = await auth();

  if (!userId) {
    return { user: null, tenantId: "" };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { user: null, tenantId: "" };
  }

  // Resolve tenantId from request host (subdomain-based multi-tenancy).
  // In production, headers().get("host") is used; the default tenant is
  // derived from the subdomain segment before the first dot.
  const tenantId = await resolveTenantId();

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  );

  return {
    user: {
      id: userId,
      clerkUserId: userId,
      email: primaryEmail?.emailAddress ?? "",
    },
    tenantId,
  };
}

/**
 * Extracts the tenantId from the current request host.
 * The subdomain is used as the tenant slug and resolved to a tenantId
 * via the database. Throws if the tenant cannot be resolved.
 */
async function resolveTenantId(): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  // Extract subdomain: "acme.ctrlplus.com" → "acme"
  const subdomain = host.split(".")[0];

  if (!subdomain || subdomain === "localhost") {
    const devTenantId = process.env.DEV_TENANT_ID;
    if (!devTenantId) {
      throw new Error("DEV_TENANT_ID environment variable is required for local development");
    }
    return devTenantId;
  }

  const { prisma } = await import("@/lib/prisma");
  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
    select: { id: true },
  });

  if (!tenant) {
    throw new Error(`Tenant not found for subdomain: ${subdomain}`);
  }

  return tenant.id;
}
