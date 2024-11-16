import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
