import { z } from 'zod';

import {
  createTemplatePreview,
  TEMPLATE_STYLES,
  type TemplatePreviewInput,
  type TemplatePreviewResult
} from '../../features/visualizer/use-cases/template-preview';
import {
  createUploadPreview,
  type UploadPreviewResult
} from '../../features/visualizer/use-cases/upload-preview';
import { createMutationAuditLogger } from '../audit/log-mutation-event';
import { requirePermission } from '../auth/require-permission';
import { RateLimitError } from '../rate-limit/fixed-window-limiter';
import { uploadRateLimiter } from '../rate-limit/upload-rate-limit';
import { uploadStore } from '../storage/upload-store';
import { assertTenantScope } from '../tenancy/assert-tenant-scope';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './shared';

export interface CreateTemplatePreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly payload: TemplatePreviewInput;
}

export interface CreateUploadPreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
  readonly wrapName: string;
  readonly vehicleName: string;
}

const templatePreviewPayloadSchema = z.object({
  templateStyle: z.enum(TEMPLATE_STYLES),
  wrapName: z.string().trim().min(1).max(120),
  primaryColor: z.string().trim().min(1).max(50),
  accentColor: z.string().trim().min(1).max(50),
  vehicleName: z.string().trim().min(1).max(120)
});

const createTemplatePreviewActionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  payload: templatePreviewPayloadSchema
});

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

export async function createTemplatePreviewAction(
  input: CreateTemplatePreviewActionInput
): Promise<TemplatePreviewResult> {
  const validatedInput = validateActionInput(createTemplatePreviewActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, validatedInput.tenantId);

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'catalog:read'
  });

  return createTemplatePreview(validatedInput.payload);
}

export async function createUploadPreviewAction(
  input: CreateUploadPreviewActionInput
): Promise<UploadPreviewResult> {
  const validatedInput = validateActionInput(createUploadPreviewActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, validatedInput.tenantId);
  const audit = createMutationAuditLogger({
    headers: validatedInput.headers,
    tenantId,
    source: 'action.create-upload-preview',
    eventPrefix: 'upload.preview.create'
  });

  audit.requested({
    tenantId,
    fileName: validatedInput.fileName,
    mimeType: validatedInput.mimeType,
    byteLength: validatedInput.bytes.byteLength
  });

  const permissionContext = await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'catalog:write'
  });

  const decision = uploadRateLimiter.consume(`upload:${tenantId}:${permissionContext.user.userId}`);
  if (!decision.allowed) {
    audit.log({
      level: 'warn',
      suffix: 'rejected',
      data: {
        tenantId,
        reason: 'rate_limit_exceeded',
        retryAfterSeconds: decision.retryAfterSeconds
      }
    });

    throw new RateLimitError('Upload rate limit exceeded', decision.retryAfterSeconds);
  }

  const storedUpload = uploadStore.save({
    tenantId,
    fileName: validatedInput.fileName,
    mimeType: validatedInput.mimeType,
    bytes: validatedInput.bytes
  });

  const preview = createUploadPreview({
    upload: storedUpload,
    wrapName: validatedInput.wrapName,
    vehicleName: validatedInput.vehicleName
  });

  audit.succeeded({
    tenantId,
    uploadId: preview.uploadId,
    byteLength: storedUpload.byteLength,
    mimeType: storedUpload.mimeType
  });

  return preview;
}
