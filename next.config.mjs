import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 390, 480, 768, 1024, 1280, 1600],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['react-icons/fa', 'react-icons/fa6', 'react-icons/si', 'react-icons/di', 'react-icons/tb', 'react-icons/vsc'],
    optimizeCss: true,
  },
  outputFileTracingRoot: process.cwd(),
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);