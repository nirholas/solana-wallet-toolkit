/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: Cloudflare Pages serves the out/ directory.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;
