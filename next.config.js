/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  compress: true,
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
