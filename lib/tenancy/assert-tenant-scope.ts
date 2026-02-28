import { TenantAccessError } from './require-tenant';

export function assertTenantScope(
  requestTenantId: string,
  recordTenantId: string,
  message = 'Cross-tenant access denied'
): void {
  if (requestTenantId !== recordTenantId) {
    throw new TenantAccessError(message, 403);
  }
}
