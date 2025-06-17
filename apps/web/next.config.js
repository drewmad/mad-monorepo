/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
    serverActions: true
  },
  reactStrictMode: true,
  eslint: {
    dirs: ['app', 'components', 'lib']
  }
};

module.exports = nextConfig; 