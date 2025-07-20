/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Ensure these server-only packages are externalized for server components/API routes
    serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken', 'mongodb']
  },
  // Removed webpack fallback for crypto as it's not needed for server-side packages
}

export default nextConfig
