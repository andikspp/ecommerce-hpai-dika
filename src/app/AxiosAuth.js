"use client";

import axios from "axios";

// Login memakai cookie httpOnly yang dikirim browser otomatis ke /api/* (same-origin lewat
// rewrite Next.js), jadi tidak ada token yang perlu dipasang di header.
//
// Daftarkan interceptor sekali, di level modul, supaya sudah aktif sebelum
// useEffect komponen mana pun mengirim request pertama.
if (typeof window !== "undefined" && !window.__axiosAuthInstalled) {
    window.__axiosAuthInstalled = true;

    const isApiCall = (config) => typeof config?.url === "string" && config.url.startsWith("/api/");
    const onAdminPage = () => window.location.pathname.startsWith("/admin");

    axios.interceptors.request.use((config) => {
        // Browser yang login sebagai user dan admin sekaligus mengirim kedua cookie;
        // header ini memberi tahu backend untuk memakai sesi admin di halaman /admin.
        if (isApiCall(config) && onAdminPage()) {
            config.headers = config.headers || {};
            config.headers["X-Auth-Scope"] = "admin";
        }
        return config;
    });

    // Sesi admin habis (cookie 1 jam) saat sedang di halaman admin: kembali ke halaman login
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            const { config, response } = error;
            if (
                response?.status === 401 &&
                isApiCall(config) &&
                !config.skipAuthRedirect &&
                onAdminPage() &&
                window.location.pathname !== "/admin/login"
            ) {
                window.location.href = "/admin/login";
            }
            return Promise.reject(error);
        }
    );
}

export default function AxiosAuth() {
    return null;
}
