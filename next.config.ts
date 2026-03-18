import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    images: {
        qualities: [75, 90],
    },
    experimental: {
        optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    },
}

export default nextConfig
