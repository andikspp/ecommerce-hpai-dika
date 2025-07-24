"use client";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Password tidak sama!");
            return;
        }
        try {
            const res = await axios.post("/api/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });
            alert("Registrasi berhasil!");
            window.location.href = "/verification-code";
        } catch (error) {
            alert(error.response?.data?.error || "Registrasi gagal!");
        }
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
                        Daftar dan bergabung bersama kami untuk mendapatkan produk herbal HPAI terbaik dan terpercaya.
                    </p>
                    <ul className="text-green-700 dark:text-green-100 text-sm list-disc pl-5">
                        <li>100% Produk HPAI Asli</li>
                        <li>Pengiriman Cepat & Aman</li>
                        <li>Promo Menarik Setiap Hari</li>
                    </ul>
                </div>
                {/* Section Kanan: Form Register */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <h1 className="text-2xl font-bold mb-2 text-center text-green-700 dark:text-green-100">Register</h1>
                    <p className="mb-6 text-center text-sm text-green-600 dark:text-green-200">
                        Silakan daftar untuk mulai belanja produk herbal HPAI!
                    </p>
                    <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                        >
                            Register
                        </button>
                    </form>
                    <div className="mt-4 text-center text-sm text-green-700 dark:text-green-200">
                        Sudah punya akun? <a href="/login" className="text-green-600 hover:underline">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}