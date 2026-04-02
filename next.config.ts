import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/national',
  assetPrefix: '/national',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'earthobservations.org',
      },
      {
        protocol: 'https',
        hostname: 'gkhub.earthobservations.org',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['gkhub.earthobservations.org'],
    },
  },
};

export default nextConfig;
