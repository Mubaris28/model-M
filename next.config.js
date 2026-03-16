/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    middlewareClientMaxBodySize: 60 * 1024 * 1024, // 60MB — allows up to 5 casting photos
  },
  // Local dev only: proxy /api/* → Express backend on localhost:3001.
  // In production (Vercel), the browser calls NEXT_PUBLIC_API_URL directly — no rewrite needed.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
