import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns', 'clsx', 'zustand'],
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
