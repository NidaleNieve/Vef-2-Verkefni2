// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// If deploying to https://username.github.io/<repo>/ set this env var to "<repo>".
// If deploying to https://username.github.io/ leave it empty or unset.
const repo = process.env.NEXT_PUBLIC_GH_PAGES_REPO ?? 'Vef-2-Lokaverkefni';

const config: NextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'export',            // enables `next export`
  trailingSlash: true,         // helps GH Pages' directory-style hosting
  images: { unoptimized: true }, // next/image without an image server

  // Only apply basePath/assetPrefix for project pages
  basePath: isProd && repo ? `/${repo}` : undefined,
  assetPrefix: isProd && repo ? `/${repo}/` : undefined,
};

export default config;

/*
// next.config.js
/** @type {import('next').NextConfig} */
/*
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

*/
