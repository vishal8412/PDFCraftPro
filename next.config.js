/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx", ".mjs"], // allow .mjs resolution
    };
    return config;
  },
};

module.exports = nextConfig;
