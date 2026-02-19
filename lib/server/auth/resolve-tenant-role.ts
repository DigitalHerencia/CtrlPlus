import { isRole, type Role } from '../../../features/authz/permissions';

type TenantRoleBindings = Readonly<Record<string, Readonly<Record<string, Role>>>>;

const DEFAULT_NON_PRODUCTION_ROLE_BINDINGS: TenantRoleBindings = {
  tenant_acme: {
    user_123: 'manager',
    user_owner: 'owner',
    user_manager: 'manager',
    user_scheduler: 'scheduler',
    user_viewer: 'viewer'
  },
  tenant_beta: {
    user_owner: 'owner',
    user_manager: 'manager',
    user_scheduler: 'scheduler',
    user_viewer: 'viewer'
  }
};

function parseRoleBindings(rawValue: string): TenantRoleBindings {
  const parsedValue = JSON.parse(rawValue) as unknown;

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    throw new Error('AUTH_TENANT_ROLE_BINDINGS must be a JSON object');
  }

  const roleBindings: Record<string, Record<string, Role>> = {};

  for (const [tenantId, membershipValue] of Object.entries(parsedValue as Record<string, unknown>)) {
    if (!membershipValue || typeof membershipValue !== 'object' || Array.isArray(membershipValue)) {
      throw new Error(`AUTH_TENANT_ROLE_BINDINGS[${tenantId}] must be an object`);
    }

    const tenantRoleBindings: Record<string, Role> = {};
    for (const [userId, roleValue] of Object.entries(membershipValue as Record<string, unknown>)) {
      if (typeof roleValue !== 'string' || !isRole(roleValue)) {
        throw new Error(
          `AUTH_TENANT_ROLE_BINDINGS[${tenantId}][${userId}] must be one of owner|manager|scheduler|viewer`
        );
      }

      tenantRoleBindings[userId] = roleValue;
    }

    roleBindings[tenantId] = tenantRoleBindings;
  }

  return roleBindings;
}

function readRoleBindings(): TenantRoleBindings {
  const configuredBindings = process.env.AUTH_TENANT_ROLE_BINDINGS;
  if (!configuredBindings) {
    return process.env.NODE_ENV === 'production' ? {} : DEFAULT_NON_PRODUCTION_ROLE_BINDINGS;
  }

  return parseRoleBindings(configuredBindings);
}

export function resolveTenantRole(tenantId: string, userId: string): Role | null {
  const roleBindings = readRoleBindings();
  const role = roleBindings[tenantId]?.[userId];
  return role ?? null;
}

