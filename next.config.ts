import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable Next.js hot reloading for better development experience
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Re-enable webpack hot module replacement for better DX
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  eslint: {
    // Enable ESLint checking during builds
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
