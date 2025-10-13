/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3002/api/v1',
  },
  images: {
    domains: ['localhost', 'nycmg.com'],
  },
};

module.exports = nextConfig;