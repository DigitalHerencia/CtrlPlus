export interface AuthenticatedUser {
  readonly userId: string;
  readonly email: string;
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
  readonly headers: Readonly<Record<string, string | undefined>>;
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

export function requireAuth(input: RequireAuthInput): AuthenticatedUser {
  const userId = readHeader(input.headers, 'x-clerk-user-id');
  const email = readHeader(input.headers, 'x-clerk-user-email');

  if (!userId || !email) {
    throw new AuthError('Authentication required', 401);
  }

  return {
    userId,
    email
  };
}

