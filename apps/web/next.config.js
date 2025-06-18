/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ui', '@db'],
  experimental: {
    appDir: true,
    typedRoutes: true,
    serverActions: true
  },
  reactStrictMode: true,
  eslint: {
    dirs: ['app', 'components', 'lib']
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com']
  }
};

module.exports = nextConfig; 