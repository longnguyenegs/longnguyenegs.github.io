import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/longnt_blog',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
