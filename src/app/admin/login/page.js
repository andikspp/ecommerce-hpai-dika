"use client";
import { useState } from "react";
import axios from "axios";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await axios.post("/api/admin/login", form);
            setMessage(res.data.message || "Login berhasil!");
            if (res.data.token) {
                localStorage.setItem("adminToken", res.data.token);
            }
            if (res.data.username) {
                localStorage.setItem("adminUsername", res.data.username);
            }
            window.location.href = "/admin/dashboard";
        } catch (err) {
            setMessage(
                err.response?.data?.error || "Login gagal. Silakan cek kembali data Anda."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <div className="bg-white dark:bg-green-900 shadow-2xl rounded-2xl flex flex-col sm:flex-row w-full max-w-3xl overflow-hidden">
                {/* Section Kiri: Ilustrasi/Admin Branding */}
                <div className="hidden sm:flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-800 dark:from-green-800 dark:to-green-900 w-1/2 p-8">
                    <svg width="80" height="80" viewBox="0 0 64 64" fill="none" className="mb-6">
                        <circle cx="32" cy="32" r="32" fill="#22c55e" />
                        <path d="M32 18c-6 9-12 12-12 18a12 12 0 0024 0c0-6-6-9-12-18z" fill="#fff" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin Panel</h2>
                    <p className="text-green-100 text-center">
                        Selamat datang di halaman admin. Silakan login untuk mengelola website.
                    </p>
                </div>
                {/* Section Kanan: Form Login */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <h1 className="text-2xl font-bold mb-4 text-center text-green-700 dark:text-green-100">Login Admin</h1>
                    <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                            autoComplete="username"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                            autoComplete="current-password"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Login"}
                        </button>
                    </form>
                    {message && (
                        <div className={`mt-4 text-center text-sm ${message.includes("gagal") ? "text-red-600" : "text-green-700 dark:text-green-200"}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}