const nextBuildId = require("next-build-id");
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: [
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
    ],
  },
  compress: false,
  poweredByHeader: false,
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
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eu.cdn.beatsaver.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "na.cdn.beatsaver.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.akamai.steamstatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "sentry",
    project: "scoresaber-reloaded",
    url: "https://sentry.fascinated.cc/",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: false,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
