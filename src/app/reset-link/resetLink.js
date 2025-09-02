"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
    FaEye,
    FaEyeSlash,
    FaLock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaArrowLeft,
    FaSpinner
} from "react-icons/fa";
import Swal from "sweetalert2";

// Component yang menggunakan useSearchParams
function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [checkingToken, setCheckingToken] = useState(true);

    // Validasi token saat component mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setTokenValid(false);
                setCheckingToken(false);
                return;
            }

            try {
                await axios.post("/api/auth/validate-reset-token", { token });
                setTokenValid(true);
            } catch (error) {
                setTokenValid(false);
                console.error("Token validation failed:", error);
            } finally {
                setCheckingToken(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi password
        if (newPassword.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Password Terlalu Pendek",
                text: "Password harus minimal 6 karakter.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Password Tidak Cocok",
                text: "Konfirmasi password tidak sesuai dengan password baru.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/auth/reset-password", {
                token,
                newPassword
            });

            await Swal.fire({
                icon: "success",
                title: "Password Berhasil Direset!",
                text: "Password Anda telah berhasil diubah. Silakan login dengan password baru.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });

            router.push("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal Reset Password",
                text: error.response?.data?.error || "Terjadi kesalahan saat mereset password.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { level: 0, text: "", color: "" };
        if (password.length < 6) return { level: 1, text: "Lemah", color: "text-red-500" };
        if (password.length < 8) return { level: 2, text: "Sedang", color: "text-yellow-500" };
        if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return { level: 4, text: "Sangat Kuat", color: "text-green-500" };
        }
        return { level: 3, text: "Kuat", color: "text-blue-500" };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    // Loading state saat mengecek token
    if (checkingToken) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Memvalidasi Token...
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Mohon tunggu sebentar
                    </p>
                </div>
            </div>
        );
    }

    // Token tidak valid
    if (tokenValid === false) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Token Tidak Valid
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {!token
                                ? "Token reset password tidak ditemukan dalam URL."
                                : "Token reset password tidak valid atau sudah kedaluwarsa. Silakan buat permintaan reset password baru."
                            }
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/forgot-password")}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Request Reset Baru
                            </button>
                            <button
                                onClick={() => router.push("/login")}
                                className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Kembali ke Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaLock className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Masukkan password baru untuk akun Anda
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password Baru
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Masukkan password baru"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.level === 1 ? 'bg-red-500 w-1/4' :
                                                        passwordStrength.level === 2 ? 'bg-yellow-500 w-2/4' :
                                                            passwordStrength.level === 3 ? 'bg-blue-500 w-3/4' :
                                                                passwordStrength.level === 4 ? 'bg-green-500 w-full' : 'w-0'
                                                    }`}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                            {passwordStrength.text}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Minimal 6 karakter. Gunakan kombinasi huruf, angka, dan simbol untuk keamanan terbaik.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Konfirmasi Password Baru
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Konfirmasi password baru"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {confirmPassword && (
                                <div className="mt-2 flex items-center gap-2">
                                    {newPassword === confirmPassword ? (
                                        <>
                                            <FaCheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-green-600 dark:text-green-400">Password cocok</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                                            <span className="text-sm text-red-600 dark:text-red-400">Password tidak cocok</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="w-5 h-5 animate-spin" />
                                    Mereset Password...
                                </>
                            ) : (
                                <>
                                    <FaLock className="w-5 h-5" />
                                    Reset Password
                                </>
                            )}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Kembali ke Login
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Note */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <FaCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                Tips Keamanan
                            </h4>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Gunakan password yang unik dan tidak mudah ditebak</li>
                                <li>• Jangan gunakan password yang sama dengan akun lain</li>
                                <li>• Simpan password dengan aman atau gunakan password manager</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading component untuk fallback
function ResetPasswordLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Memuat Reset Password...
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Mohon tunggu sebentar
                </p>
            </div>
        </div>
    );
}

// Main component dengan Suspense wrapper
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordLoading />}>
            <ResetPasswordContent />
        </Suspense>
    );
}