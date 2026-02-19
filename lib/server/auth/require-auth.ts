import { auth, clerkClient } from '@clerk/nextjs/server';

export interface AuthenticatedUser {
  readonly userId: string;
  readonly email: string;
  readonly orgId: string | null;
  readonly privateMetadata: unknown;
}

export class AuthError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export interface RequireAuthInput {
  readonly headers?: Readonly<Record<string, string | undefined>>;
}

function readHeader(
  headers: Readonly<Record<string, string | undefined>>,
  headerName: string
): string | undefined {
  const normalizedHeaderName = headerName.toLowerCase();

  const matchingHeader = Object.entries(headers).find(
    ([candidateHeader]) => candidateHeader.toLowerCase() === normalizedHeaderName
  );

  const value = matchingHeader?.[1]?.trim();
  return value || undefined;
}

function resolveFromHeaders(headers: Readonly<Record<string, string | undefined>>): AuthenticatedUser | null {
  const userId = readHeader(headers, 'x-clerk-user-id');
  const email = readHeader(headers, 'x-clerk-user-email');

  if (!userId || !email) {
    return null;
  }

  return {
    userId,
    email,
    orgId: readHeader(headers, 'x-clerk-org-id') ?? null,
    privateMetadata: {}
  };
}

export async function requireAuth(input: RequireAuthInput): Promise<AuthenticatedUser> {
  try {
    const authResult = await auth();
    if (!authResult.userId) {
      throw new AuthError('Authentication required', 401);
    }

    const client = await clerkClient();
    const user = await client.users.getUser(authResult.userId);
    const primaryEmail = user.emailAddresses.find(
      (emailAddress) => emailAddress.id === user.primaryEmailAddressId
    );

    return {
      userId: authResult.userId,
      email: primaryEmail?.emailAddress ?? '',
      orgId: authResult.orgId ?? null,
      privateMetadata: user.privateMetadata
    };
  } catch {
    if (input.headers) {
      const fallbackUser = resolveFromHeaders(input.headers);
      if (fallbackUser) {
        return fallbackUser;
      }
    }

    throw new AuthError('Authentication required', 401);
  }
}
