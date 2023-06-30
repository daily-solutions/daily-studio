const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
    serverActions: true,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
