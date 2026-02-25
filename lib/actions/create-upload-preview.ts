import { z } from 'zod';

import {
  createUploadPreview,
  type UploadPreviewResult
} from '../../features/visualizer/upload-preview';
import { requirePermission } from '../auth/require-permission';
import { RateLimitError } from '../rate-limit/fixed-window-limiter';
import { uploadRateLimiter } from '../rate-limit/upload-rate-limit';
import { uploadStore } from '../storage/upload-store';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './validation';

export interface CreateUploadPreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
  readonly wrapName: string;
  readonly vehicleName: string;
}

const createUploadPreviewActionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(100),
  bytes: z.instanceof(Uint8Array).refine((bytes) => bytes.byteLength > 0, {
    message: 'Upload payload cannot be empty'
  }),
  wrapName: z.string().trim().min(1).max(120),
  vehicleName: z.string().trim().min(1).max(120)
});

export async function createUploadPreviewAction(
  input: CreateUploadPreviewActionInput
): Promise<UploadPreviewResult> {
  const validatedInput = validateActionInput(createUploadPreviewActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  const permissionContext = await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'catalog:write'
  });

  const decision = uploadRateLimiter.consume(`upload:${tenantId}:${permissionContext.user.userId}`);
  if (!decision.allowed) {
    throw new RateLimitError('Upload rate limit exceeded', decision.retryAfterSeconds);
  }

  const storedUpload = uploadStore.save({
    tenantId,
    fileName: validatedInput.fileName,
    mimeType: validatedInput.mimeType,
    bytes: validatedInput.bytes
  });

  return createUploadPreview({
    upload: storedUpload,
    wrapName: validatedInput.wrapName,
    vehicleName: validatedInput.vehicleName
  });
}
