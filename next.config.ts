import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId() {
    return Date.now().toString();
  },
  images:{
    remotePatterns: [
      {
        hostname: "api.producthunt.com",
        protocol: "https"
      }
    ]
  }
};

export default nextConfig;
