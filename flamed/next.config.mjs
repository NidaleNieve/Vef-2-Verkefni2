const isProd = process.env.NODE_ENV === 'production';
const repo = process.env.NEXT_PUBLIC_GH_PAGES_REPO ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ['dynamic-media-cdn.tripadvisor.com'],
    },
    basePath: isProd && repo ? `/${repo}` : undefined,
    assetPrefix: isProd && repo ? `/${repo}/` : undefined,
};

export default nextConfig;
