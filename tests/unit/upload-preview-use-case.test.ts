import { describe, expect, it } from 'vitest';

import { createUploadPreview } from '../../features/visualizer/use-cases/upload-preview';
import type { StoredUpload } from '../../lib/storage/upload-store';

function createStoredUpload(overrides: Partial<StoredUpload> = {}): StoredUpload {
  return {
    id: overrides.id ?? 'upload_1',
    tenantId: overrides.tenantId ?? 'tenant_acme',
    fileName: overrides.fileName ?? 'mock-upload.png',
    mimeType: overrides.mimeType ?? 'image/png',
    byteLength: overrides.byteLength ?? 128,
    checksum:
      overrides.checksum ??
      'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    storageUrl: overrides.storageUrl ?? '/storage/tenant_acme/upload_1',
  };
}

function decodeSvgDataUrl(dataUrl: string): string {
  const prefix = 'data:image/svg+xml,';
  expect(dataUrl.startsWith(prefix)).toBe(true);
  return decodeURIComponent(dataUrl.slice(prefix.length));
}

describe('upload preview use-case', () => {
  it('maps png uploads to minimal template style with checksum-derived colors', () => {
    const preview = createUploadPreview({
      upload: createStoredUpload(),
      wrapName: 'Acme Carbon',
      vehicleName: 'Transit Van',
    });
    const svgMarkup = decodeSvgDataUrl(preview.svgDataUrl);

    expect(preview.uploadId).toBe('upload_1');
    expect(preview.storageUrl).toBe('/storage/tenant_acme/upload_1');
    expect(preview.html).toContain('template-minimal');
    expect(svgMarkup).toContain('stop-color="#abcdef"');
    expect(svgMarkup).toContain('stop-color="#012345"');
  });

  it('maps webp uploads to sport template style', () => {
    const preview = createUploadPreview({
      upload: createStoredUpload({
        id: 'upload_2',
        mimeType: 'image/webp',
        storageUrl: '/storage/tenant_acme/upload_2',
      }),
      wrapName: 'Acme Sport',
      vehicleName: 'Sprinter',
    });

    expect(preview.uploadId).toBe('upload_2');
    expect(preview.html).toContain('template-sport');
  });

  it('falls back to luxury template and default colors for non-hex checksum segments', () => {
    const preview = createUploadPreview({
      upload: createStoredUpload({
        id: 'upload_3',
        mimeType: 'image/jpeg',
        checksum: '%%%%%%%%%%%%',
        storageUrl: '/storage/tenant_acme/upload_3',
      }),
      wrapName: 'Acme Luxury',
      vehicleName: 'Cargo Van',
    });
    const svgMarkup = decodeSvgDataUrl(preview.svgDataUrl);

    expect(preview.html).toContain('template-luxury');
    expect(svgMarkup).toContain('stop-color="#336699"');
  });
});
