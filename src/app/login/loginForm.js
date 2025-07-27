"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
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
            const res = await axios.post("/api/login", form);
            setMessage(res.data.message || "Login berhasil!");
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            window.location.href = "/";
        } catch (err) {
            setMessage(
                err.response?.data?.error || "Login gagal. Silakan cek kembali data Anda."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <div className="bg-white dark:bg-green-900 shadow-lg rounded-xl flex flex-col sm:flex-row w-full max-w-3xl">
                {/* Section Kiri: Pengenalan Website */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 border-b sm:border-b-0 sm:border-r border-green-200 dark:border-green-800">
                    <div className="mb-4">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="32" fill="#22c55e" />
                            <path d="M32 18c-6 9-12 12-12 18a12 12 0 0024 0c0-6-6-9-12-18z" fill="#fff" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-2 text-center">Agen HPAI Ika</h2>
                    <p className="text-green-600 dark:text-green-200 text-center text-base mb-4">
                        Agen penjual produk herbal HPAI terpercaya.
                        Kami menyediakan berbagai produk herbal HPAI yang dijamin keasliannya
                    </p>
                    <ul className="text-green-700 dark:text-green-100 text-sm list-disc pl-5">
                        <li>100% Produk HPAI Asli</li>
                        <li>Pengiriman Cepat & Aman</li>
                    </ul>
                </div>
                {/* Section Kanan: Form Login */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <h1 className="text-2xl font-bold mb-2 text-center text-green-700 dark:text-green-100">Login</h1>
                    <p className="mb-6 text-center text-sm text-green-600 dark:text-green-200">
                        Silakan login untuk mulai belanja produk HPAI!
                    </p>
                    <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
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
                        <div className="mt-4 text-center text-sm text-green-700 dark:text-green-200">
                            {message}
                        </div>
                    )}
                    <div className="mt-4 flex flex-col items-center gap-2">
                        <a
                            href="/forgot-password"
                            className="text-green-600 hover:underline text-sm text-center"
                        >
                            Lupa password?
                        </a>
                        <div className="text-sm text-green-700 dark:text-green-200 text-center">
                            Belum punya akun? <a href="/register" className="text-green-600 hover:underline">Daftar</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}