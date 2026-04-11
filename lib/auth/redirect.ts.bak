const DEFAULT_POST_AUTH_REDIRECT = '/catalog'

export function sanitizePostAuthRedirect(redirectUrl?: string | null): string {
    if (!redirectUrl) {
        return DEFAULT_POST_AUTH_REDIRECT
    }

    if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
        return DEFAULT_POST_AUTH_REDIRECT
    }

    return redirectUrl
}
