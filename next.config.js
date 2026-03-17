/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    middlewareClientMaxBodySize: 60 * 1024 * 1024, // 60MB — allows up to 5 casting photos
  },

  // Local dev only: proxy /api/* → Express backend on 127.0.0.1:3001.
  // In production (Vercel) this rewrite is SKIPPED (NODE_ENV === "production"),
  // and the browser calls NEXT_PUBLIC_API_URL directly instead.
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:3001/api/:path*",
      },
    ];
  },

  // Serve video files with byte-range + no-cache headers so browsers can
  // seek/stream them without hitting ERR_CACHE_OPERATION_NOT_SUPPORTED.
  async headers() {
    return [
      {
        source: "/images/hero-video/:file*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
          { key: "Content-Type", value: "video/mp4" },
        ],
      },
    ];
  },
};

export default nextConfig;
