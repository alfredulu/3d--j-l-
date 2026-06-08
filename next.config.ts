import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@splinetool/react-spline', '@splinetool/runtime'],
};

export default nextConfig;
