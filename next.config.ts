import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix routes-manifest issue in Next.js 15
  experimental: {
    turbo: undefined,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@tabler/icons-react'],
  },
  images: {
    domains: [
      "salt.tikicdn.com",
      "xjanua.me", // For your uploaded images
      "localhost",
    ],
  },
  // Optimize production build
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Enable SWC minification
  swcMinify: true,
  // Reduce build output
  productionBrowserSourceMaps: false,
  // Optimize fonts
  optimizeFonts: true,
};

export default nextConfig;
