/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  serverExternalPackages: ['@jsr/supabase__supabase-js'],
  env: {
    CUSTOM_KEY: 'my-value'
  },
  turbopack: {},
}

module.exports = nextConfig