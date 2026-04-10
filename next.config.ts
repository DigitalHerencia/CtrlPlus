import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    allowedDevOrigins: ['127.0.0.1', 'localhost'],
    experimental: {
        serverActions: {
            // Catalog uploads currently flow through server actions as data URLs.
            // The default 1 MB cap is too small for real production wrap assets.
            bodySizeLimit: '8mb',
        },
    },
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
                // Hugging Face Spaces deliver generated images from the hf.space host,
                // not the huggingface.co/spaces page URL.
                hostname: 'cannatech-ctrlplus.hf.space',
                port: '',
                pathname: '/gradio_api/**',
                search: '',
            },
        ],
    },
}

export default nextConfig
