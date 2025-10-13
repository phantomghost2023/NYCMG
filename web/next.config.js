/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
  },
  images: {
    domains: ['localhost', 'nycmg.com'],
  },
};

module.exports = nextConfig;