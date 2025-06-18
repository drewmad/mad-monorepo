/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ui', '@db'],
  experimental: {
    typedRoutes: true
  },
  reactStrictMode: true,
  eslint: {
    dirs: ['app', 'components', 'lib']
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com']
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 