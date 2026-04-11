/**
 * @introduction Uploads — TODO: short one-line summary of file-validation.ts
 *
 * @description TODO: longer description for file-validation.ts. Keep it short — one or two sentences.
 * Domain: uploads
 * Public: TODO (yes/no)
 */
/**
 * ALLOWED_WRAP_IMAGE_MIME_TYPES — TODO: brief description.
 */
export const ALLOWED_WRAP_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
/**
 * MAX_WRAP_IMAGE_BYTES — TODO: brief description.
 */
export const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024

/**
 * validateWrapImageFile — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function validateWrapImageFile(file: File): void {
    if (!ALLOWED_WRAP_IMAGE_MIME_TYPES.has(file.type)) {
        throw new Error('Unsupported image format. Allowed: JPEG, PNG, WEBP.')
    }

    if (file.size <= 0 || file.size > MAX_WRAP_IMAGE_BYTES) {
        throw new Error('Image exceeds size limit of 5MB.')
    }
}
