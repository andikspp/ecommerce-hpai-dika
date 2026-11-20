/** @type {import('next').NextConfig} */
// Dibaca saat BUILD (rewrite ikut tertanam di hasil build), jadi set sebelum `next build`.
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  // Image Docker memakai output "standalone" (server minimal tanpa seluruh node_modules).
  // Hanya aktif jika NEXT_OUTPUT=standalone, agar `next start` biasa tetap berfungsi.
  ...(process.env.NEXT_OUTPUT === "standalone" && { output: "standalone" }),
  async rewrites() {
    // Semua request /api/* diteruskan apa adanya ke backend Express (termasuk cookie sesi).
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
