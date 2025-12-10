import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "cdnimage.dailian.co.kr",
      },
      {
        protocol: "https",
        hostname: "akamai.pizzahut.co.kr",
      },
      {
        protocol: "https",
        hostname: "ssproxy.ucloudbiz.olleh.com",
      },
      {
        protocol: "https",
        hostname: "pcdn.pelicana.co.kr",
      },
      {
        protocol: "https",
        hostname: "img.etoday.co.kr",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      }
    ],
  },
};

export default nextConfig;
