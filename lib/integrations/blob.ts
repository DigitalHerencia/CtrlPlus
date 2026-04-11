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
    buildCloudinaryPublicDeliveryUrl,
    getCloudinaryCredentials,
    buildCloudinarySignature,
    destroyCloudinaryAsset,
    extractCloudinaryPublicId,
    getCloudinaryPublicTransformation,
    normalizeCloudinaryUploadResponse,
    type CloudinaryDeliveryVariant,
    type CloudinaryStoredAsset,
} from '@/lib/integrations/cloudinary'

// Generic adapter-facing names
/**
 * buildBlobPublicDeliveryUrl — TODO: brief description.
 */
/**
 * buildBlobPublicDeliveryUrl — TODO: brief description.
 */
export const buildBlobPublicDeliveryUrl = buildCloudinaryPublicDeliveryUrl
/**
 * getBlobCredentials — TODO: brief description.
 */
/**
 * getBlobCredentials — TODO: brief description.
 */
export const getBlobCredentials = getCloudinaryCredentials
/**
 * buildBlobSignature — TODO: brief description.
 */
/**
 * buildBlobSignature — TODO: brief description.
 */
export const buildBlobSignature = buildCloudinarySignature
/**
 * destroyBlobAsset — TODO: brief description.
 */
/**
 * destroyBlobAsset — TODO: brief description.
 */
export const destroyBlobAsset = destroyCloudinaryAsset
/**
 * extractBlobPublicId — TODO: brief description.
 */
/**
 * extractBlobPublicId — TODO: brief description.
 */
export const extractBlobPublicId = extractCloudinaryPublicId
/**
 * getBlobPublicTransformation — TODO: brief description.
 */
/**
 * getBlobPublicTransformation — TODO: brief description.
 */
export const getBlobPublicTransformation = getCloudinaryPublicTransformation
/**
 * normalizeBlobUploadResponse — TODO: brief description.
 */
/**
 * normalizeBlobUploadResponse — TODO: brief description.
 */
export const normalizeBlobUploadResponse = normalizeCloudinaryUploadResponse

/**
 * BlobCredentials — TODO: brief description of this type.
 */
/**
 * BlobCredentials — TODO: brief description of this type.
 */
export type BlobCredentials = ReturnType<typeof getBlobCredentials>
/**
 * BlobDeliveryVariant — TODO: brief description of this type.
 */
/**
 * BlobDeliveryVariant — TODO: brief description of this type.
 */
export type BlobDeliveryVariant = CloudinaryDeliveryVariant
/**
 * BlobStoredAsset — TODO: brief description of this type.
 */
/**
 * BlobStoredAsset — TODO: brief description of this type.
 */
export type BlobStoredAsset = CloudinaryStoredAsset

// Note: This file intentionally adapts the existing Cloudinary integration into a
// generic "blob" integration surface. Future providers should implement the same
// exported helpers here so upload/storage callers don't depend on provider names.
