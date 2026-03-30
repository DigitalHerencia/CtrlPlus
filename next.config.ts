import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    logging: {
        fetches: {
            fullUrl: true,
        },
        incomingRequests: {
            ignore: [/^\/_next\//, /^\/favicon\.ico$/],
        },
    },
    images: {
        qualities: [75, 90],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
                search: '',
            },
        ],
    },
}

export default nextConfig
