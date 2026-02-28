import type { TenantId, UserId } from './shared';

export interface AuthSessionContract {
  readonly userId: UserId;
  readonly tenantId: TenantId;
  readonly permissions: readonly string[];
}
