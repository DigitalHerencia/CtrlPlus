import { hasPermission, type Permission, type Role } from '../../../features/authz/permissions';
import { requireAuth, type AuthenticatedUser } from './require-auth';
import { resolveTenantRole } from './resolve-tenant-role';

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
  readonly tenantId: string;
  readonly tenantClerkOrgId: string;
  readonly permission: Permission;
}

export interface PermissionContext {
  readonly user: AuthenticatedUser;
  readonly role: Role;
  readonly permission: Permission;
}

export async function requirePermission(input: RequirePermissionInput): Promise<PermissionContext> {
  const user = await requireAuth({
    headers: input.headers
  });

  const role = resolveTenantRole({
    tenantId: input.tenantId,
    tenantClerkOrgId: input.tenantClerkOrgId,
    activeOrgId: user.orgId,
    actorUserId: user.userId,
    privateMetadata: user.privateMetadata
  });

  if (!role) {
    throw new PermissionError('Tenant membership required');
  }

  if (!hasPermission(role, input.permission)) {
    throw new PermissionError(`Permission denied for ${input.permission}`);
  }

  return {
    user,
    role,
    permission: input.permission
  };
}
