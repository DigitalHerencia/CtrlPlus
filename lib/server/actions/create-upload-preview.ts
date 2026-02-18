import {
  createUploadPreview,
  type UploadPreviewResult
} from '../../../features/visualizer/upload-preview';
import { requirePermission } from '../auth/require-permission';
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

export function createUploadPreviewAction(
  input: CreateUploadPreviewActionInput
): UploadPreviewResult {
  requirePermission({
    headers: input.headers,
    permission: 'catalog:write'
  });

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

