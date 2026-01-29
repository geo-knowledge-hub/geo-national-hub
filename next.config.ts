import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/national',
  assetPrefix: '/national',
  output: 'standalone',
  images: {
    domains: ['earthobservations.org'],
  },
  env: {
    TYPESENSE_HOST: process.env.TYPESENSE_HOST,
    TYPESENSE_PORT: process.env.TYPESENSE_PORT,
    TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL,
    TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY,
  },
};

/**
 * Force dynamic rendering
 */
export const dynamic = 'force-dynamic';

/**
 * Export the next config
 */
export default nextConfig;
