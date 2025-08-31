"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    FaUser,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
    FaCog,
    FaChartBar,
    FaUsers,
    FaBox
} from "react-icons/fa";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if already logged in
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            if (token) {
                window.location.href = "/admin/dashboard";
            }
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear message when user starts typing
        if (message) setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.username.trim() || !form.password.trim()) {
            setMessage("Username dan password harus diisi!");
            return;
        }

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

            // Add delay for better UX
            setTimeout(() => {
                window.location.href = "/admin/dashboard";
            }, 1000);

        } catch (err) {
            setMessage(
                err.response?.data?.error || "Login gagal. Silakan cek kembali data Anda."
            );
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 p-4">
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden border border-gray-200 dark:border-gray-700">

                {/* Left Section: Branding & Features */}
                <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 dark:from-green-800 dark:via-green-900 dark:to-emerald-900 lg:w-3/5 p-12 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                    <div className="relative z-10 text-center">
                        {/* Logo/Icon */}
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                <FaShieldAlt className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Admin Panel
                            </h1>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-6 mt-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                                <FaUsers className="w-8 h-8 mb-3 mx-auto text-green-200" />
                                <h3 className="font-semibold mb-1">Kelola User</h3>
                                <p className="text-xs text-green-100">Manajemen pengguna</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                                <FaBox className="w-8 h-8 mb-3 mx-auto text-green-200" />
                                <h3 className="font-semibold mb-1">Produk</h3>
                                <p className="text-xs text-green-100">Kelola inventory</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                                <FaChartBar className="w-8 h-8 mb-3 mx-auto text-green-200" />
                                <h3 className="font-semibold mb-1">Dashboard</h3>
                                <p className="text-xs text-green-100">Analisis bisnis</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                                <FaCog className="w-8 h-8 mb-3 mx-auto text-green-200" />
                                <h3 className="font-semibold mb-1">Pengaturan</h3>
                                <p className="text-xs text-green-100">Konfigurasi sistem</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Login Form */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaShieldAlt className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                        </div>

                        {/* Welcome Text */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Selamat Datang
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Admin Panel Website Stokis HNI & HPAI Ika
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Masukkan username"
                                        value={form.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        autoComplete="username"
                                        required
                                    />
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Masukkan password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Memproses...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <FaShieldAlt className="w-5 h-5 mr-2" />
                                        Masuk ke Admin Panel
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-xl text-center font-medium ${message.includes("gagal") || message.includes("harus diisi")
                                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                                : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Security Note */}
                        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-3">
                                <FaShieldAlt className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                                        Keamanan Admin
                                    </h4>
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        Pastikan Anda memiliki akses administrator yang valid. Jangan bagikan kredensial login Anda kepada siapa pun.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}