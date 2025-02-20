/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

const nextConfig = {
  transpilePackages: ["@mui/x-charts"],
  // sourceMap 사용안함
  productionBrowserSourceMaps: false,
  // 이미지 형식 변경
  images: {
    minimumCacheTTL: 600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  i18n: {
    locales: ["ko-KR", "en-US"],
    defaultLocale: "ko-KR",
  },
  trailingSlash: true,
  reactStrictMode: false,
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
