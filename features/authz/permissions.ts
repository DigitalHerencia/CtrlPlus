export const ROLES = ['owner', 'manager', 'scheduler', 'viewer'] as const;

export type Role = (typeof ROLES)[number];

export type Permission =
  | 'catalog:read'
  | 'catalog:write'
  | 'schedule:read'
  | 'schedule:write'
  | 'billing:read'
  | 'billing:write'
  | 'admin:read'
  | 'admin:write';

const ROLE_PERMISSIONS: Readonly<Record<Role, ReadonlySet<Permission>>> = {
  owner: new Set<Permission>([
    'catalog:read',
    'catalog:write',
    'schedule:read',
    'schedule:write',
    'billing:read',
    'billing:write',
    'admin:read',
    'admin:write'
  ]),
  manager: new Set<Permission>([
    'catalog:read',
    'catalog:write',
    'schedule:read',
    'schedule:write',
    'billing:read',
    'admin:read'
  ]),
  scheduler: new Set<Permission>(['catalog:read', 'schedule:read', 'schedule:write']),
  viewer: new Set<Permission>(['catalog:read', 'schedule:read'])
};

export function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
}

export function getRolePermissions(role: Role): readonly Permission[] {
  return Array.from(ROLE_PERMISSIONS[role]);
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

