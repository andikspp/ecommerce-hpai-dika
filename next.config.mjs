/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  async rewrites() {
    // Semua request /api/* yang tidak punya route sendiri di src/app/api diteruskan apa adanya
    // ke backend Express, termasuk header Authorization. (src/app/api/rajaongkir tetap ditangani Next.)
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
