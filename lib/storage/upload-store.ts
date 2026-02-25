import { tenantScopedPrisma } from '../db/prisma';

export interface SaveUploadInput {
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
}

export interface StoredUpload {
  readonly id: string;
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
  readonly checksum: string;
  readonly storageUrl: string;
}

export class UploadValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'UploadValidationError';
    this.statusCode = statusCode;
  }
}

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Readonly<Record<string, readonly string[]>> = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp']
};

function isSafeFileName(fileName: string): boolean {
  if (!fileName.trim() || fileName.length > 128) {
    return false;
  }

  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return false;
  }

  return /^[A-Za-z0-9._ -]+$/.test(fileName);
}

function extensionForFileName(fileName: string): string {
  const periodIndex = fileName.lastIndexOf('.');
  if (periodIndex < 0) {
    return '';
  }

  return fileName.slice(periodIndex).toLowerCase();
}

function matchesMimeSignature(mimeType: string, bytes: Uint8Array): boolean {
  if (mimeType === 'image/png') {
    const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
    return pngSignature.every((value, index) => bytes[index] === value);
  }

  if (mimeType === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === 'image/webp') {
    const riff = String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0, bytes[2] ?? 0, bytes[3] ?? 0);
    const webp = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0);
    return riff === 'RIFF' && webp === 'WEBP';
  }

  return false;
}

export class PrismaUploadStore {
  reset(): void {
    tenantScopedPrisma.reset();
  }

  save(input: SaveUploadInput): StoredUpload {
    if (!ALLOWED_MIME_TYPES.has(input.mimeType)) {
      throw new UploadValidationError(`Unsupported upload mime type: ${input.mimeType}`, 415);
    }

    if (!isSafeFileName(input.fileName)) {
      throw new UploadValidationError('Upload file name is invalid', 400);
    }

    const allowedExtensions = MIME_EXTENSIONS[input.mimeType] ?? [];
    const extension = extensionForFileName(input.fileName);
    if (!allowedExtensions.includes(extension)) {
      throw new UploadValidationError('Upload file extension does not match mime type', 415);
    }

    if (input.bytes.byteLength === 0) {
      throw new UploadValidationError('Upload payload cannot be empty', 400);
    }

    if (input.bytes.byteLength > MAX_UPLOAD_BYTES) {
      throw new UploadValidationError('Upload payload exceeds the 5MB limit', 413);
    }

    if (!matchesMimeSignature(input.mimeType, input.bytes)) {
      throw new UploadValidationError('Upload payload signature does not match mime type', 415);
    }

    return tenantScopedPrisma.createUpload(input);
  }

  get(tenantId: string, id: string): StoredUpload | null {
    return tenantScopedPrisma.getUploadByTenant(tenantId, id);
  }
}

export const uploadStore = new PrismaUploadStore();
