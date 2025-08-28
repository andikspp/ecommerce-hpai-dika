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
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        
        // Check password strength
        if (e.target.name === "password") {
            checkPasswordStrength(e.target.value);
        }
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return { text: "Sangat Lemah", color: "text-red-500" };
            case 2: return { text: "Lemah", color: "text-orange-500" };
            case 3: return { text: "Sedang", color: "text-yellow-500" };
            case 4: return { text: "Kuat", color: "text-green-500" };
            case 5: return { text: "Sangat Kuat", color: "text-green-600" };
            default: return { text: "", color: "" };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validation
        if (form.password !== form.confirmPassword) {
            setMessage("Password tidak sama!");
            setLoading(false);
            return;
        }

        if (form.password.length < 6) {
            setMessage("Password minimal 6 karakter!");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });
            setMessage("Registrasi berhasil! Silakan verifikasi email Anda.");
            // Redirect dengan delay untuk menampilkan pesan sukses
            setTimeout(() => {
                window.location.href = "/verification-code";
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Registrasi gagal! Silakan coba lagi.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center p-4">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
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
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-2xl">🌿</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Stokis HNI & HPAI Ika</h2>
                                        <p className="text-green-100 text-sm">Toko Herbal Terpercaya</p>
                                    </div>
                                </div>

                                {/* Welcome Text */}
                                <div className="mb-8">
                                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                        Bergabung Bersama Kami!
                                    </h3>
                                    <p className="text-green-100 text-lg leading-relaxed">
                                        Daftar sekarang dan nikmati kemudahan berbelanja produk herbal HPAI 
                                        original dengan berbagai keuntungan eksklusif.
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="space-y-4 mb-8">
                                    {[
                                        { icon: "🎯", text: "Akses ke Semua Produk HPAI" },
                                        { icon: "💝", text: "Promo & Diskon Eksklusif" },
                                        { icon: "🚀", text: "Pengiriman Prioritas" },
                                        { icon: "💬", text: "Konsultasi Personal" }
                                    ].map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-white">
                                            <span className="text-lg">{benefit.icon}</span>
                                            <span className="text-green-100">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/20">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">1000+</div>
                                        <div className="text-green-100 text-sm">Pelanggan Puas</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">50+</div>
                                        <div className="text-green-100 text-sm">Produk HPAI</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Register Form */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="w-full max-w-md mx-auto">
                                
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                        Daftar Akun
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Buat akun baru untuk memulai berbelanja
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
                                                placeholder="Pilih username unik"
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

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="nama@email.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                                                placeholder="Buat password yang kuat"
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
                                        
                                        {/* Password Strength */}
                                        {form.password && (
                                            <div className="mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-300 ${
                                                                passwordStrength <= 2 ? 'bg-red-500' :
                                                                passwordStrength <= 3 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                            }`}
                                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-medium ${getPasswordStrengthText().color}`}>
                                                        {getPasswordStrengthText().text}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Ulangi password"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? (
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
                                        
                                        {/* Password Match Indicator */}
                                        {form.confirmPassword && (
                                            <div className="mt-2 flex items-center gap-2">
                                                {form.password === form.confirmPassword ? (
                                                    <span className="text-green-600 text-xs flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Password cocok
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 text-xs flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Password tidak cocok
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="flex items-start">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            required
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                                        />
                                        <label htmlFor="terms" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                            Saya setuju dengan{" "}
                                            <a href="/terms" className="text-green-600 hover:text-green-500 font-medium">
                                                Syarat & Ketentuan
                                            </a>{" "}
                                            dan{" "}
                                            <a href="/privacy" className="text-green-600 hover:text-green-500 font-medium">
                                                Kebijakan Privasi
                                            </a>
                                        </label>
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
                                                <span>Mendaftar...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                <span>Daftar Sekarang</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Message */}
                                {message && (
                                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${
                                        message.includes("berhasil") 
                                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            <span>{message.includes("berhasil") ? "✅" : "❌"}</span>
                                            <span>{message}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Login Link */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Sudah punya akun?{" "}
                                        <a
                                            href="/login"
                                            className="text-green-600 hover:text-green-500 font-semibold transition-colors"
                                        >
                                            Masuk sekarang
                                        </a>
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