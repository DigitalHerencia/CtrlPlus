import {
  createUploadPreview,
  type UploadPreviewResult
} from '../../../features/visualizer/upload-preview';
import { requirePermission } from '../auth/require-permission';
import { RateLimitError } from '../rate-limit/fixed-window-limiter';
import { uploadRateLimiter } from '../rate-limit/upload-rate-limit';
import { uploadStore } from '../storage/upload-store';

export interface CreateUploadPreviewActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
  readonly wrapName: string;
  readonly vehicleName: string;
}

function readHeader(
  headers: Readonly<Record<string, string | undefined>>,
  headerName: string
): string | undefined {
  const normalizedHeaderName = headerName.toLowerCase();

  const matchingHeader = Object.entries(headers).find(
    ([candidateHeader]) => candidateHeader.toLowerCase() === normalizedHeaderName
  );

  const value = matchingHeader?.[1]?.trim();
  return value || undefined;
}

function resolveRateLimitKey(input: CreateUploadPreviewActionInput): string {
  const userId = readHeader(input.headers, 'x-clerk-user-id') ?? readHeader(input.headers, 'x-user-id');
  return `upload:${input.tenantId}:${userId ?? 'anonymous'}`;
}

export function createUploadPreviewAction(
  input: CreateUploadPreviewActionInput
): UploadPreviewResult {
  requirePermission({
    headers: input.headers,
    permission: 'catalog:write'
  });

  const decision = uploadRateLimiter.consume(resolveRateLimitKey(input));
  if (!decision.allowed) {
    throw new RateLimitError('Upload rate limit exceeded', decision.retryAfterSeconds);
  }

  const storedUpload = uploadStore.save({
    tenantId: input.tenantId,
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
