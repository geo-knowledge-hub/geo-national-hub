import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/national',
  assetPrefix: '/national',
  images: {
    domains: ['earthobservations.org', 'gkhub.earthobservations.org'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['gkhub.earthobservations.org'],
    },
  },
};

export default nextConfig;
