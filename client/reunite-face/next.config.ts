import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'missing-persons-photo.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**', // Restrict to paths under /posts for security
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
