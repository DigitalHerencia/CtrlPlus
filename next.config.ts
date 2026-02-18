/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers() {
    return Promise.resolve([
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-content-type-options',
            value: 'nosniff'
          },
          {
            key: 'x-frame-options',
            value: 'DENY'
          },
          {
            key: 'referrer-policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'permissions-policy',
            value: 'camera=(), microphone=(), geolocation=(), fullscreen=(self)'
          }
        ]
      }
    ]);
  }
};

export default nextConfig;
