import { getActiveLocalUserByClerkId } from "@/lib/auth/local-user";

/**
 * Resolve a Clerk user ID to the internal database User.id.
 * This is the only supported mapping path for admin role mutations.
 */
export async function getInternalUserIdByClerkId(clerkUserId: string): Promise<string> {
  const user = await getActiveLocalUserByClerkId(clerkUserId);

  if (!user) {
    throw new Error("Forbidden: target user does not exist");
  }

  return user.id;
}
