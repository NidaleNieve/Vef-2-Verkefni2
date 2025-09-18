// Prefer using next.config.ts; keep this file minimal to avoid conflicting options.
const isProd = process.env.NODE_ENV === 'production';
const repo = process.env.NEXT_PUBLIC_GH_PAGES_REPO ?? '';

/** @type {import('next').NextConfig} */
const config = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ['dynamic-media-cdn.tripadvisor.com'],
    },
    basePath: isProd && repo ? `/${repo}` : undefined,
    assetPrefix: isProd && repo ? `/${repo}/` : undefined,
    eslint: { ignoreDuringBuilds: true },
};

export default config;
