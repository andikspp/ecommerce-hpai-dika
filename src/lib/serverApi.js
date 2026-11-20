import "server-only";

// Memanggil backend dari Server Component (berjalan di server Next, bukan di browser).
// Memakai alamat internal BACKEND_URL bila ada (mis. http://backend:5000 di Docker),
// karena server Next tidak bisa memakai rewrite /api/* miliknya sendiri.
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class BackendError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

/**
 * GET JSON dari backend. `revalidate` (detik) mengatur cache data di server Next:
 * halaman katalog boleh sedikit basi (stok tetap dicek ulang saat checkout).
 */
export async function backendGet(path, { query, revalidate = 30 } = {}) {
    const url = new URL(`/api${path}`, BACKEND_URL);
    for (const [key, value] of Object.entries(query || {})) {
        if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
    const res = await fetch(url, { next: { revalidate }, headers: { Accept: "application/json" } });
    if (!res.ok) {
        let message = `Backend membalas ${res.status}`;
        try {
            message = (await res.json()).error || message;
        } catch { }
        throw new BackendError(res.status, message);
    }
    return res.json();
}
