/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    middlewareClientMaxBodySize: 60 * 1024 * 1024, // 60MB — allows up to 5 casting photos
  },
  // Proxy /api to the Node.js backend (run with npm run dev:all)
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
