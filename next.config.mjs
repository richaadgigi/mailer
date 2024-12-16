/** @type {import('next').NextConfig} */
const nextConfig = {
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
