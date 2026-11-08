"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerificationCodePage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendIn, setResendIn] = useState(0);

    // Email diisi otomatis dari halaman registrasi (?email=...), tapi tetap bisa diketik manual
    useEffect(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("email");
        if (fromUrl) setEmail(fromUrl);
    }, []);

    // Hitung mundur tombol kirim ulang
    useEffect(() => {
        if (resendIn <= 0) return;
        const timer = setTimeout(() => setResendIn(resendIn - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await axios.post("/api/verification-code", { email, code });
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: res.data.message,
                confirmButtonText: "OK"
            });
            window.location.href = "/login";
        } catch (err) {
            setMessage(err.response?.data?.error || "Terjadi kesalahan.");
        }
        setLoading(false);
    };

    const handleResend = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage("Isi email terlebih dahulu untuk mengirim ulang kode.");
            return;
        }
        if (resendIn > 0) return;
        try {
            const res = await axios.post("/api/resend-verification-code", { email });
            setMessage(res.data.message);
            setCode("");
            setResendIn(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            setMessage(err.response?.data?.error || "Gagal mengirim ulang kode.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <div className="bg-white dark:bg-green-900 shadow-lg rounded-xl p-8 w-full max-w-sm flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 text-center text-green-700 dark:text-green-100">
                    Verifikasi Email
                </h1>
                <p className="mb-6 text-center text-sm text-green-600 dark:text-green-200">
                    Masukkan kode verifikasi yang telah dikirim ke email Anda. Kode berlaku 30 menit.
                </p>
                <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100"
                    />
                    <input
                        type="text"
                        required
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        placeholder="Kode Verifikasi"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100 text-center tracking-widest text-lg font-mono"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi"}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-center text-sm text-green-700 dark:text-green-200">
                        {message}
                    </div>
                )}
                <div className="mt-4 text-center text-sm text-green-700 dark:text-green-200">
                    Tidak menerima kode?{" "}
                    {resendIn > 0 ? (
                        <span className="text-green-500">Kirim ulang dalam {resendIn} detik</span>
                    ) : (
                        <a href="#" onClick={handleResend} className="text-green-600 hover:underline">Kirim ulang</a>
                    )}
                </div>
            </div>
        </div>
    );
}
