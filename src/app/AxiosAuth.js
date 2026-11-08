"use client";

import axios from "axios";

// Daftarkan interceptor sekali, di level modul, supaya sudah aktif sebelum
// useEffect komponen mana pun mengirim request pertama.
if (typeof window !== "undefined" && !window.__axiosAuthInstalled) {
    window.__axiosAuthInstalled = true;

    axios.interceptors.request.use((config) => {
        const isApiCall = typeof config.url === "string" && config.url.startsWith("/api/");
        const hasAuthHeader = config.headers?.Authorization || config.headers?.authorization;

        if (isApiCall && !hasAuthHeader) {
            // Halaman admin pakai token admin, halaman lain pakai token user
            const isAdminPage = window.location.pathname.startsWith("/admin");
            const token = localStorage.getItem(isAdminPage ? "adminToken" : "token");
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });
}

export default function AxiosAuth() {
    return null;
}
