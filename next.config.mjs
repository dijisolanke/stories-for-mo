/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable React 19 features
    ppr: false,
  },
  // Enable styled-components
  compiler: {
    styledComponents: true,
  },
  // Image optimization for stories
  images: {
    domains: ["cdn.sanity.io"],
  },
};

export default nextConfig;
