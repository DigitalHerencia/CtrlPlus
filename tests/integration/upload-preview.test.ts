import { beforeEach, describe, expect, it } from 'vitest';

import { createUploadPreviewAction } from '../../lib/server/actions/create-upload-preview';
import { UploadValidationError, uploadStore } from '../../lib/server/storage/upload-store';

const ownerHeaders = {
  'x-user-id': 'user_owner',
  'x-user-email': 'owner@example.com',
  'x-user-role': 'owner'
} as const;

function encodeString(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

describe('upload preview pipeline', () => {
  beforeEach(() => {
    uploadStore.reset();
  });

  it('stores uploads and returns a generated preview payload', () => {
    const result = createUploadPreviewAction({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      fileName: 'mock-wrap.png',
      mimeType: 'image/png',
      bytes: encodeString('png-bytes'),
      wrapName: 'Acme Upload Preview',
      vehicleName: 'Transit Van'
    });

    expect(result.uploadId).toBe('upload_1');
    expect(result.storageUrl).toBe('/storage/tenant_acme/upload_1');
    expect(result.html).toContain('Acme Upload Preview');
    expect(result.svgDataUrl.startsWith('data:image/svg+xml,')).toBe(true);
    expect(uploadStore.get(result.uploadId)?.checksum.length).toBe(64);
  });

  it('rejects unsupported mime types', () => {
    expect(() =>
      createUploadPreviewAction({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        fileName: 'mock-wrap.svg',
        mimeType: 'image/svg+xml',
        bytes: encodeString('<svg />'),
        wrapName: 'Invalid Upload',
        vehicleName: 'Van'
      })
    ).toThrowError(UploadValidationError);
  });
});

