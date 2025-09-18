// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// If deploying to https://username.github.io/<repo>/ set env NEXT_PUBLIC_GH_PAGES_REPO to "<repo>".
// If deploying to https://username.github.io/ leave it empty/unset.
const repo = process.env.NEXT_PUBLIC_GH_PAGES_REPO ?? '';

const config: NextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'export',            // enables `next export`
  trailingSlash: true,         // helps GH Pages' directory-style hosting
  images: {
    // Use unoptimized images since there's no Image Optimization on static hosts (GH Pages)
    unoptimized: true,
    // Allow external images used in the app (kept for dev parity; unoptimized mode doesn't proxy)
    domains: ['dynamic-media-cdn.tripadvisor.com'],
  },

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
