import type { StoredUpload } from '../../lib/storage/upload-store';
import { createTemplatePreview, type TemplateStyle } from './template-preview';

export interface UploadPreviewInput {
  readonly upload: StoredUpload;
  readonly wrapName: string;
  readonly vehicleName: string;
}

export interface UploadPreviewResult {
  readonly uploadId: string;
  readonly storageUrl: string;
  readonly html: string;
  readonly svgDataUrl: string;
}

function toHexColor(segment: string): string {
  const fallback = '336699';
  const normalized = segment.replace(/[^0-9a-f]/gi, '').slice(0, 6);
  return `#${normalized.padEnd(6, fallback)}`;
}

function templateStyleForMimeType(mimeType: string): TemplateStyle {
  if (mimeType.includes('png')) {
    return 'minimal';
  }

  if (mimeType.includes('webp')) {
    return 'sport';
  }

  return 'luxury';
}

export function createUploadPreview(input: UploadPreviewInput): UploadPreviewResult {
  const primaryColor = toHexColor(input.upload.checksum.slice(0, 6));
  const accentColor = toHexColor(input.upload.checksum.slice(6, 12));
  const templateStyle = templateStyleForMimeType(input.upload.mimeType);

  const preview = createTemplatePreview({
    templateStyle,
    wrapName: input.wrapName,
    primaryColor,
    accentColor,
    vehicleName: input.vehicleName
  });

  return {
    uploadId: input.upload.id,
    storageUrl: input.upload.storageUrl,
    html: preview.html,
    svgDataUrl: preview.svgDataUrl
  };
}

