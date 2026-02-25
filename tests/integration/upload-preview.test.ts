import { beforeEach, describe, expect, it } from 'vitest';

import { createUploadPreviewAction } from '../../lib/actions/create-upload-preview';
import { RateLimitError } from '../../lib/rate-limit/fixed-window-limiter';
import { uploadRateLimiter } from '../../lib/rate-limit/upload-rate-limit';
import { UploadValidationError, uploadStore } from '../../lib/storage/upload-store';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

function encodePngMock(): Uint8Array {
  return Uint8Array.from([
    137, 80, 78, 71, 13, 10, 26, 10,
    73, 72, 68, 82,
    0, 0, 0, 1
  ]);
}

describe('upload preview pipeline', () => {
  beforeEach(() => {
    uploadStore.reset();
    uploadRateLimiter.reset();
  });

  it('stores uploads and returns a generated preview payload', async () => {
    const result = await createUploadPreviewAction({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      fileName: 'mock-wrap.png',
      mimeType: 'image/png',
      bytes: encodePngMock(),
      wrapName: 'Acme Upload Preview',
      vehicleName: 'Transit Van'
    });

    expect(result.uploadId).toMatch(/^upload_/);
    expect(result.storageUrl).toBe(`/storage/tenant_acme/${result.uploadId}`);
    expect(result.html).toContain('Acme Upload Preview');
    expect(result.svgDataUrl.startsWith('data:image/svg+xml,')).toBe(true);
    expect(uploadStore.get('tenant_acme', result.uploadId)?.checksum.length).toBe(64);
  });

  it('rejects unsupported mime types and unsafe file names', async () => {
    await expect(
      createUploadPreviewAction({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        fileName: 'mock-wrap.svg',
        mimeType: 'image/svg+xml',
        bytes: Uint8Array.from([60, 115, 118, 103]),
        wrapName: 'Invalid Upload',
        vehicleName: 'Van'
      })
    ).rejects.toThrowError(UploadValidationError);

    await expect(
      createUploadPreviewAction({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        fileName: '../escape.png',
        mimeType: 'image/png',
        bytes: encodePngMock(),
        wrapName: 'Invalid Upload',
        vehicleName: 'Van'
      })
    ).rejects.toThrowError(UploadValidationError);
  });



  it('does not allow cross-tenant upload reads', async () => {
    const result = await createUploadPreviewAction({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      fileName: 'tenant-scope.png',
      mimeType: 'image/png',
      bytes: encodePngMock(),
      wrapName: 'Tenant Scope',
      vehicleName: 'Van'
    });

    expect(uploadStore.get('tenant_beta', result.uploadId)).toBeNull();
  });

  it('enforces tenant-scoped rate limiting for upload previews', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const result = await createUploadPreviewAction({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        fileName: `mock-${attempt}.png`,
        mimeType: 'image/png',
        bytes: encodePngMock(),
        wrapName: 'Rate Limited Upload',
        vehicleName: 'Van'
      });

      expect(result.uploadId).toMatch(/^upload_/);
    }

    await expect(
      createUploadPreviewAction({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        fileName: 'mock-6.png',
        mimeType: 'image/png',
        bytes: encodePngMock(),
        wrapName: 'Rate Limited Upload',
        vehicleName: 'Van'
      })
    ).rejects.toThrowError(RateLimitError);
  });
});

