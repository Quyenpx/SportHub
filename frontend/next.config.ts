import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Ensure we don't have font optimization issues
  optimizeFonts: false,
};

export default nextConfig;
