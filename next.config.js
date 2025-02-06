// next.config.js
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
    minimumCacheTTL: 0,
  },
  experimental: {
    largePageDataBytes: 128 * 100000, // Increase the limit for large data
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

// Only run setupDevPlatform in development
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
