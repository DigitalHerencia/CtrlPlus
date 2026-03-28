export const ALLOWED_WRAP_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
export const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024

export function validateWrapImageFile(file: File): void {
    if (!ALLOWED_WRAP_IMAGE_MIME_TYPES.has(file.type)) {
        throw new Error('Unsupported image format. Allowed: JPEG, PNG, WEBP.')
    }

    if (file.size <= 0 || file.size > MAX_WRAP_IMAGE_BYTES) {
        throw new Error('Image exceeds size limit of 5MB.')
    }
}
