/** @type {import('next').NextConfig} */
const path = require('path')
const dotenvLoad = require('dotenv-load')

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  swcLoader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    loader: 'akamai',
    path: '/'
    // path: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_IMAGE_HOST : process.env.NEXT_PUBLIC_IMAGE_HOST_PROD,
  },
}

module.exports = nextConfig
