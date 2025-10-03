import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p16-sign-sg.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "r2.rivalsaiki.hackathon.bayu-ai.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin('./lib/i18n-request.ts');

export default withNextIntl(nextConfig);