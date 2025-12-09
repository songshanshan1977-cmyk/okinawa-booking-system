/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // 🚫 禁用 App Router，强制使用 Pages Router
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
