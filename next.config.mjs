/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lovely-flamingo-139.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'sleek-capybara-771.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      // Allow all protocols and hostnames
      // {
      //   protocol: '**', // Matches any protocol (http, https, etc.)
      //   hostname: '**', // Matches any domain
      // },
    ],
  },
};

export default nextConfig;
