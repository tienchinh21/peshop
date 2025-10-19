import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix routes-manifest issue in Next.js 15
  experimental: {
    turbo: undefined,
  },
  images: {
    domains: [
      "salt.tikicdn.com",
      "xjanua.me", // For your uploaded images
      "localhost",
    ],
  },
};

export default nextConfig;
