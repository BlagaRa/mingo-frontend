import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";

loadEnv();

const nextConfig: NextConfig = {
  // Plan: no Cache Components in this frontend-only phase.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
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
