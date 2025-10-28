// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      canvas: false, // ✅ prevent "Can't resolve 'canvas'"
    };
    return config;
  },
};

module.exports = nextConfig;
