/**
 * Blob adapter: provider-agnostic surface for storage/blob operations.
 *
 * This module adapts the active provider implementation (Cloudinary today)
 * into a stable, provider-agnostic API consumed by the rest of the application
 * (for example, `lib/uploads/storage.ts`). Do not import Cloudinary directly
 * in application code; import from `lib/integrations/blob` instead so the
 * underlying provider can be replaced with minimal changes.
 */
import {
    getCloudinaryCredentials,
    buildCloudinarySignature,
    extractCloudinaryPublicId,
} from '@/lib/integrations/cloudinary'

// Generic adapter-facing names
export const getBlobCredentials = getCloudinaryCredentials
export const buildBlobSignature = buildCloudinarySignature
export const extractBlobPublicId = extractCloudinaryPublicId

export type BlobCredentials = ReturnType<typeof getBlobCredentials>

// Note: This file intentionally adapts the existing Cloudinary integration into a
// generic "blob" integration surface. Future providers should implement the same
// exported helpers here so upload/storage callers don't depend on provider names.
