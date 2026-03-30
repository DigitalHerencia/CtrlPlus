export function assertNeonPooledRuntimeUrl(connectionString: string): void {
    let hostname: string

    try {
        hostname = new URL(connectionString).hostname.toLowerCase()
    } catch {
        throw new Error('DATABASE_URL must be a valid PostgreSQL connection string.')
    }

    const isNeonHost = hostname.includes('neon.tech')

    if (isNeonHost && !hostname.includes('-pooler')) {
        throw new Error(
            "DATABASE_URL must use Neon's pooled hostname (-pooler) for application traffic. " +
                'Use the direct connection only for Prisma CLI operations in prisma.config.ts.'
        )
    }
}

export function assertApprovedRemoteHost(url: URL, isAllowedHost: (hostname: string) => boolean): void {
    const host = url.hostname.toLowerCase()
    if (!isAllowedHost(host)) {
        throw new Error('Image host is not allowed')
    }
}
