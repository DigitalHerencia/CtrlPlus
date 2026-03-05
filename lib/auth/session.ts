import { auth, currentUser } from "@clerk/nextjs/server";

export interface Session {
  user: {
    id: string;
    clerkId: string;
    email: string | null;
  } | null;
  tenantId: string;
}

/**
 * Returns the current session derived from Clerk auth.
 * Resolves the internal user ID from Clerk's session claims.
 */
export async function getSession(): Promise<Session> {
  const { userId: clerkUserId, sessionClaims } = await auth();

  if (!clerkUserId) {
    return { user: null, tenantId: "" };
  }

  const tenantId = (sessionClaims?.tenantId as string | undefined) ?? "";

  const clerkUser = await currentUser();

  return {
    user: {
      id: clerkUserId,
      clerkId: clerkUserId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? null,
    },
    tenantId,
  };
}
