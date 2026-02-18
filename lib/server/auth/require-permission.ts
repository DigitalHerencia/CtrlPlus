import { hasPermission, isRole, type Permission, type Role } from '../../../features/authz/permissions';
import { AuthError, requireAuth, type AuthenticatedUser } from './require-auth';

export class PermissionError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = 'PermissionError';
    this.statusCode = statusCode;
  }
}

export interface RequirePermissionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly permission: Permission;
}

export interface PermissionContext {
  readonly user: AuthenticatedUser;
  readonly role: Role;
  readonly permission: Permission;
}

function readRole(headers: Readonly<Record<string, string | undefined>>): Role {
  const roleHeader = Object.entries(headers).find(
    ([headerName]) => headerName.toLowerCase() === 'x-user-role'
  )?.[1];

  if (!roleHeader) {
    return 'viewer';
  }

  const normalizedRole = roleHeader.trim().toLowerCase();
  if (!isRole(normalizedRole)) {
    throw new AuthError('Invalid role supplied', 403);
  }

  return normalizedRole;
}

export function requirePermission(input: RequirePermissionInput): PermissionContext {
  const user = requireAuth({
    headers: input.headers
  });

  const role = readRole(input.headers);
  if (!hasPermission(role, input.permission)) {
    throw new PermissionError(`Permission denied for ${input.permission}`);
  }

  return {
    user,
    role,
    permission: input.permission
  };
}

