/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    middlewareClientMaxBodySize: 60 * 1024 * 1024, // 60MB — allows up to 5 casting photos
  },
  // Proxy /api to backend. Dev: localhost:3001. Production: set NEXT_PUBLIC_API_URL (e.g. https://model-m.onrender.com).
  async rewrites() {
    const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
