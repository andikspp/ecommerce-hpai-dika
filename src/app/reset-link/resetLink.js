"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetLinkPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Password dan konfirmasi password wajib diisi.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("/api/reset-password", { token, password });
            setSuccess("Password berhasil direset! Silakan login.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Terjadi kesalahan saat mereset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white dark:bg-green-900 shadow-xl rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700 dark:text-green-100">
                Reset Password
            </h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-1 font-semibold">Password Baru</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Masukkan password baru"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Konfirmasi Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Ulangi password baru"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition"
                >
                    {loading ? "Memproses..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}