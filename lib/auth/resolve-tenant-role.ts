import { isRole, type Role } from '../../../features/authz/permissions';

interface TenantRoleMetadata {
  readonly tenantRoles?: Readonly<Record<string, string>>;
  readonly orgRoles?: Readonly<Record<string, string>>;
}

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

export interface ResolveTenantRoleInput {
  readonly tenantId: string;
  readonly tenantClerkOrgId: string;
  readonly activeOrgId: string | null;
  readonly actorUserId: string;
  readonly privateMetadata: unknown;
}

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

function parsePrivateMetadata(privateMetadata: unknown): TenantRoleMetadata {
  if (!privateMetadata || typeof privateMetadata !== 'object' || Array.isArray(privateMetadata)) {
    return {};
  }

  const metadata = privateMetadata as Record<string, unknown>;
  const tenantRoles = metadata.tenantRoles;
  const orgRoles = metadata.orgRoles;

  return {
    tenantRoles:
      tenantRoles && typeof tenantRoles === 'object' && !Array.isArray(tenantRoles)
        ? (tenantRoles as Record<string, string>)
        : undefined,
    orgRoles:
      orgRoles && typeof orgRoles === 'object' && !Array.isArray(orgRoles)
        ? (orgRoles as Record<string, string>)
        : undefined
  };
}

function readRole(candidate: string | undefined): Role | null {
  if (!candidate || !isRole(candidate)) {
    return null;
  }

  return candidate;
}

export function resolveTenantRole(input: ResolveTenantRoleInput): Role | null {
  if (input.activeOrgId !== input.tenantClerkOrgId) {
    return null;
  }

  const metadata = parsePrivateMetadata(input.privateMetadata);
  const tenantRole = readRole(metadata.tenantRoles?.[input.tenantId]);
  if (tenantRole) {
    return tenantRole;
  }

  const orgRole = readRole(metadata.orgRoles?.[input.tenantClerkOrgId]);
  if (orgRole) {
    return orgRole;
  }

  return readRoleBindings()[input.tenantId]?.[input.actorUserId] ?? null;
}
