/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable React 19 features
    ppr: false,
    transpilePackages: ["sanity"],
  },
  // Enable styled-components
  compiler: {
    styledComponents: true,
  },
  // Image optimization for stories
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;