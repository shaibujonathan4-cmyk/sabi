import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackTree: true, // optional
  },
  // Set root directory scope
  turbopack: {
    root: '/home',
  },
};

export default nextConfig;
