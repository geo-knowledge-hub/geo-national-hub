import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/national',
  assetPrefix: '/national',
  output: 'standalone',
  images: {
    domains: ['earthobservations.org'],
  },
};

export default nextConfig;
