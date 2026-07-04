import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the tracing root to this project (a stray lockfile lives in the home dir).
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cinematic media is externally hosted on a CDN, referenced via lib/config.ts.
    // Add the CDN host here when the real asset host is known (see docs/ASSET-MANIFEST.md).
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
