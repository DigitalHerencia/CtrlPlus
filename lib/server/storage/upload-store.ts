import { createHash } from 'node:crypto';

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

export class InMemoryUploadStore {
  private readonly uploads = new Map<string, StoredUpload>();

  reset(): void {
    this.uploads.clear();
  }

  save(input: SaveUploadInput): StoredUpload {
    if (!ALLOWED_MIME_TYPES.has(input.mimeType)) {
      throw new UploadValidationError(`Unsupported upload mime type: ${input.mimeType}`, 415);
    }

    if (input.bytes.byteLength === 0) {
      throw new UploadValidationError('Upload payload cannot be empty', 400);
    }

    if (input.bytes.byteLength > MAX_UPLOAD_BYTES) {
      throw new UploadValidationError('Upload payload exceeds the 5MB limit', 413);
    }

    const id = `upload_${this.uploads.size + 1}`;
    const checksum = createHash('sha256').update(input.bytes).digest('hex');
    const upload: StoredUpload = {
      id,
      tenantId: input.tenantId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      byteLength: input.bytes.byteLength,
      checksum,
      storageUrl: `/storage/${input.tenantId}/${id}`
    };

    this.uploads.set(id, upload);
    return upload;
  }

  get(id: string): StoredUpload | null {
    return this.uploads.get(id) ?? null;
  }
}

export const uploadStore = new InMemoryUploadStore();

