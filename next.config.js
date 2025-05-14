/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ztvgjiocgphuqvnmpdnh.supabase.co',
      },
    ],
  },
  // Add any other Next.js config options here
};

module.exports = nextConfig;
