/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1024, 1280, 1600],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons/fa', 'react-icons/fa6', 'react-icons/si', 'react-icons/di', 'react-icons/tb'],
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;