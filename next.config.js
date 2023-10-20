const nextBuildId = require("next-build-id");

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  compress: true,
  env: {
    NEXT_PUBLIC_BUILD_ID: nextBuildId.sync({ dir: __dirname }),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fascinated.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.scoresaber.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
