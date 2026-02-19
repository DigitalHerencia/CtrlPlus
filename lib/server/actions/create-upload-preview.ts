import {
  createUploadPreview,
  type UploadPreviewResult
} from '../../../features/visualizer/upload-preview';
import { requirePermission } from '../auth/require-permission';
import { RateLimitError } from '../rate-limit/fixed-window-limiter';
import { uploadRateLimiter } from '../rate-limit/upload-rate-limit';
import { uploadStore } from '../storage/upload-store';
import { requireTenant } from '../tenancy/require-tenant';

export interface CreateUploadPreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
  readonly wrapName: string;
  readonly vehicleName: string;
}

export function createUploadPreviewAction(
  input: CreateUploadPreviewActionInput
): UploadPreviewResult {
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  const permissionContext = requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:write'
  });

  const decision = uploadRateLimiter.consume(`upload:${tenantId}:${permissionContext.user.userId}`);
  if (!decision.allowed) {
    throw new RateLimitError('Upload rate limit exceeded', decision.retryAfterSeconds);
  }

  const storedUpload = uploadStore.save({
    tenantId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    bytes: input.bytes
  });

  return createUploadPreview({
    upload: storedUpload,
    wrapName: input.wrapName,
    vehicleName: input.vehicleName
  });
}
