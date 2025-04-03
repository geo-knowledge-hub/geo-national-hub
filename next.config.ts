import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    domains: ['earthobservations.org'],
  },
};

export default nextConfig;
