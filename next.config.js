/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

const nextConfig = {
  // sourceMap 사용안함
  productionBrowserSourceMaps: false,
  // 이미지 형식 변경
  images: {
    domains: ["d11ay48rmhjgmh.cloudfront.net"],
    minimumCacheTTL: 600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // trailingSlash: true,
  reactStrictMode: false,
  webpack: (config) => {
    config.experiments = { ...config.experiments };
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    esmExternals: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? true : false,
  },
};

module.exports = nextConfig;
