import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: ["staging-api.eduelle.com", "api.eduelle.com"], // whitelist this domain
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
