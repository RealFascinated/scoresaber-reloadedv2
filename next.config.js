/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fascinated.cc",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
