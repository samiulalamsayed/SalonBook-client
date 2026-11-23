import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://salonbook-server-teal.vercel.app/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;