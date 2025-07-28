"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("/api/forgot-password", { email });
            setSuccess("Link reset password telah dikirim ke email Anda.");
            setEmail("");
        } catch (err) {
            setError("Gagal mengirim link reset password. Pastikan email Anda terdaftar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <div className="bg-white dark:bg-green-900 shadow-lg rounded-xl p-8 w-full max-w-sm flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 text-center text-green-700 dark:text-green-100">
                    Lupa Password
                </h1>
                <p className="mb-6 text-center text-sm text-green-600 dark:text-green-200">
                    Masukkan email yang terdaftar untuk mendapatkan link reset password.
                </p>
                {success && (
                    <div className="mb-4 w-full text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2 text-center">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 w-full text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2 text-center">
                        {error}
                    </div>
                )}
                <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                        Kirim Link Reset
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-green-700 dark:text-green-200">
                    Ingat password? <a href="/login" className="text-green-600 hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
}