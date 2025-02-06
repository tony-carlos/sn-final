// next.config.js
/** @type {import('next').NextConfig} */
const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");

const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
    minimumCacheTTL: 0,
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  async headers() {
    return [
      {
        source: "/api/quotes/:id/pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = async () => {
  // Only run setupDevPlatform in development
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
  return nextConfig;
};
