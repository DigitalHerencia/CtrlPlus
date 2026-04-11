/**
 * @introduction Auth — TODO: short one-line summary of redirect.ts
 *
 * @description TODO: longer description for redirect.ts. Keep it short — one or two sentences.
 * Domain: auth
 * Public: TODO (yes/no)
 */
const DEFAULT_POST_AUTH_REDIRECT = '/catalog'

/**
 * sanitizePostAuthRedirect — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function sanitizePostAuthRedirect(redirectUrl?: string | null): string {
    if (!redirectUrl) {
        return DEFAULT_POST_AUTH_REDIRECT
    }

    if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
        return DEFAULT_POST_AUTH_REDIRECT
    }

    return redirectUrl
}
