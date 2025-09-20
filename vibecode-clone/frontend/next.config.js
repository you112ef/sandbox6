/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    // Monaco Editor configuration
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });

    // Handle WebAssembly files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/:path*`,
      },
      {
        source: '/api/agents/:path*',
        destination: `${process.env.AGENT_MANAGER_URL || 'http://localhost:8001'}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;