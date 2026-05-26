import type { NextConfig } from 'next';
import { loadRootEnv } from './lib/load-root-env';

loadRootEnv();

const nextConfig: NextConfig = {
  typedRoutes: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    NEXT_PUBLIC_GOOGLE_DEV_MOCK:
      process.env.NEXT_PUBLIC_GOOGLE_DEV_MOCK ?? process.env.GOOGLE_DEV_MOCK ?? 'true',
  },
};

export default nextConfig;
