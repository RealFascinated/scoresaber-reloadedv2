const nextBuildId = require("next-build-id");
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: false });
const InfisicalClient = require("infisical-node");

const infisicalClient = new InfisicalClient({
  token: process.env.INFISICAL_TOKEN,
  siteURL: "https://secrets.fascinated.cc",
});

// Define remote patterns for images
const remotePatterns = [
  { protocol: "https", hostname: "cdn.fascinated.cc", pathname: "/**" },
  { protocol: "https", hostname: "cdn.scoresaber.com", pathname: "/**" },
  { protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/**" },
  { protocol: "https", hostname: "eu.cdn.beatsaver.com", pathname: "/**" },
  { protocol: "https", hostname: "na.cdn.beatsaver.com", pathname: "/**" },
  {
    protocol: "https",
    hostname: "avatars.akamai.steamstatic.com",
    pathname: "/**",
  },
];

// Define optimized package imports
const optimizePackageImports = [
  "react",
  "react-dom",
  "next-themes",
  "react-tostify",
  "websocket",
  "cslx",
  "chart.js",
  "react-chartjs-2",
  "country-list",
  "@sentry/nextjs",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  poweredByHeader: false,
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports,
  },
  env: {
    NEXT_PUBLIC_BUILD_ID:
      process.env.GIT_REV || nextBuildId.sync({ dir: __dirname }),
    NEXT_PUBLIC_BUILD_TIME: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }),
  },
  images: { remotePatterns },
};

module.exports = async () =>
  withSentryConfig(
    withBundleAnalyzer(nextConfig),
    {
      silent: true,
      org: "sentry",
      project: "scoresaber-reloaded",
      url: "https://sentry.fascinated.cc",
      authToken: (await infisicalClient.getSecret("SENTRY_AUTH_TOKEN"))
        .secretValue,
      dryRun: process.env.NODE_ENV !== "development",
    },
    {
      widenClientFileUpload: false,
      transpileClientSDK: false,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
    },
  );
