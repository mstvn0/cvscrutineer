import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow loopback + LAN hostnames to load Next.js HMR/dev assets. */
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
