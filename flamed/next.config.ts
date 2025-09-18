// next.config.js
const isProd = process.env.NODE_ENV === 'production';
const repo = 'myrepo';

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { appDir: true },
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  assetPrefix: isProd && repo ? `/${repo}/` : '',
  basePath:   isProd && repo ? `/${repo}`   : '',
};

