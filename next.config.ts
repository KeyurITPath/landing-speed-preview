import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging-api.eduelle.com',
        port: '', // keep empty unless you have a custom port
        pathname: '/**', // allow all image paths
      },
      {
        protocol: 'https',
        hostname: 'stagingcoursemarketplace2025.s3.amazonaws.com',
        pathname: '/**', // allow all paths
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,

  // Environment variables that should be exposed to the browser
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },

  // Public runtime configuration
  publicRuntimeConfig: {
    SERVER_URL: process.env.SERVER_URL,
  },

  // Server-side runtime configuration
  serverRuntimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    API_KEY: process.env.API_KEY,
  },

  // app router tree shaking and optimization
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'react-icons',
      '@emotion/styled',
      '@emotion/react',
      '@emotion/cache',
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
