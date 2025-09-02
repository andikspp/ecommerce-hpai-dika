"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function LoginForm() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
            // Redirect dengan delay untuk menampilkan pesan sukses
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } catch (err) {
            setMessage(
                err.response?.data?.error || "Login gagal. Silakan cek kembali data Anda."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center p-4">

            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
                    <div className="grid md:grid-cols-2">

                        {/* Left Section - Branding */}
                        <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 p-8 lg:p-12 flex flex-col justify-center">
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                            <div className="relative z-10">
                                {/* Logo */}
                                <div className="flex items-center space-x-3 mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Stokis HNI & HPAI Ika</h2>
                                        <p className="text-green-100 text-sm">Toko Herbal Terpercaya</p>
                                    </div>
                                </div>

                                {/* Welcome Text */}
                                <div className="mb-8">
                                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                        Selamat Datang Kembali!
                                    </h3>
                                    <p className="text-green-100 text-lg leading-relaxed">
                                        Masuk ke akun Anda untuk melanjutkan belanja produk herbal HPAI terbaik
                                        dan nikmati pengalaman berbelanja yang tak terlupakan.
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="space-y-4">
                                    {[
                                        { icon: "✅", text: "100% Produk HPAI Original" },
                                        { icon: "🚚", text: "Pengiriman Cepat & Aman" },
                                        { icon: "💰", text: "Harga Distributor Terbaik" },
                                        { icon: "🤝", text: "Konsultasi Gratis 24/7" }
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-white">
                                            <span className="text-lg">{feature.icon}</span>
                                            <span className="text-green-100">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Contact Info */}
                                <div className="mt-8 pt-6 border-t border-white/20">
                                    <p className="text-green-100 text-sm mb-2">Butuh bantuan?</p>
                                    <a
                                        href="https://wa.me/6282294317043"
                                        className="inline-flex items-center gap-2 text-white hover:text-green-200 transition-colors"
                                    >
                                        <span>📱</span>
                                        <span className="font-medium">0822-9431-7043</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Login Form */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="w-full max-w-md mx-auto">

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                        Masuk
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Silakan masuk dengan akun Anda
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Username Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder="Masukkan username Anda"
                                                value={form.username}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Masukkan password Anda"
                                                value={form.password}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h4a2 2 0 012 2v2zm0 0V9a4 4 0 00-4-4v0a4 4 0 00-4 4v6" />
                                                </svg>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.758 7.758M18.364 18.364L5.636 5.636" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember & Forgot */}
                                    <div className="flex items-center justify-between">
                                        <a
                                            href="/forgot-password"
                                            className="text-sm text-green-600 hover:text-green-500 font-medium transition-colors"
                                        >
                                            Lupa password?
                                        </a>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Memproses...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Masuk</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Message */}
                                {message && (
                                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${message.includes("berhasil")
                                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                                        : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
                                        }`}>
                                        <div className="flex items-center gap-2">
                                            <span>{message.includes("berhasil") ? "✅" : "❌"}</span>
                                            <span>{message}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Register Link */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Belum punya akun?{" "}
                                        <a
                                            href="/register"
                                            className="text-green-600 hover:text-green-500 font-semibold transition-colors"
                                        >
                                            Daftar sekarang
                                        </a>
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="mt-8 relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Atau belanja sebagai tamu</span>
                                    </div>
                                </div>

                                {/* Guest Shopping */}
                                <div className="mt-6">
                                    <Link
                                        href="/product"
                                        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span>Lanjut Belanja</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}