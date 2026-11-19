import axios from "axios";

// Token login disimpan backend di cookie httpOnly: JavaScript tidak bisa (dan tidak perlu)
// membacanya. Browser mengirim cookie itu otomatis ke /api/*. Untuk tahu siapa yang sedang
// login, tanyakan ke backend lewat /api/me atau /api/admin/me.

const CACHE_MS = 5000;
let userCache = { at: 0, promise: null };

// User yang sedang login ({ id, username, email }) atau null. Hasil di-cache sebentar supaya
// beberapa komponen di satu halaman tidak memanggil /api/me berkali-kali.
export function getCurrentUser({ fresh = false } = {}) {
    if (fresh || !userCache.promise || Date.now() - userCache.at > CACHE_MS) {
        userCache = {
            at: Date.now(),
            promise: axios
                .get("/api/me", { skipAuthRedirect: true })
                .then((res) => res.data)
                .catch(() => null),
        };
    }
    return userCache.promise;
}

export async function getCurrentAdmin() {
    try {
        const res = await axios.get("/api/admin/me", { skipAuthRedirect: true });
        return res.data;
    } catch {
        return null;
    }
}

// Hapus cookie sesi user di server. Pemanggil yang mengurus redirect.
export async function logoutUser() {
    userCache = { at: 0, promise: null };
    try {
        await axios.post("/api/logout");
    } catch {
        // Tetap lanjut: cookie juga akan kedaluwarsa sendiri
    }
}

export async function logoutAdmin() {
    try {
        await axios.post("/api/admin/logout");
    } catch {
        // Tetap lanjut: cookie juga akan kedaluwarsa sendiri
    }
    try {
        localStorage.removeItem("adminUsername"); // hanya nama untuk tampilan, bukan rahasia
    } catch { }
}

// Dipakai tombol logout di semua halaman admin
export async function logoutAdminAndRedirect() {
    await logoutAdmin();
    window.location.href = "/admin/login";
}
