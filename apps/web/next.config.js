/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ui', '@mad/db'],
  experimental: {
    typedRoutes: true
  },
  reactStrictMode: true,
  eslint: {
    dirs: ['app', 'components', 'lib']
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com', 'i.pravatar.cc']
  }
};

module.exports = nextConfig;