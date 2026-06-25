/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1024, 1280, 1600],
  },
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
