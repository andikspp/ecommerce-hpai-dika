"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function TambahKategoriPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                window.location.href = "/admin/login";
            } else {
                setIsChecking(false);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await axios.post("/api/admin/kategori", { nama: name });
            setName("");
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Kategori berhasil ditambahkan!",
                timer: 1500,
                showConfirmButton: false
            });
            router.push("/admin/kategori");
        } catch (err) {
            console.log("Error adding category:", err);
            await Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.error || "Gagal menambah kategori."
            });
        } finally {
            setLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
                <span className="text-green-700 dark:text-green-100 text-xl font-semibold">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <AdminSidebar />
            <main className="flex-1 p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-white dark:bg-green-900 rounded-2xl shadow-lg p-8">
                    <button
                        onClick={() => router.push("/admin/kategori")}
                        className="flex items-center gap-2 text-green-700 dark:text-green-100 mb-6 hover:underline"
                    >
                        <FaArrowLeft /> Kembali
                    </button>
                    <h1 className="text-2xl font-bold text-green-700 dark:text-green-100 mb-6 text-center">Tambah Kategori</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">Nama Kategori</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                placeholder="Masukkan nama kategori"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-60"
                        >
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan Kategori"}
                        </button>
                        {message && (
                            <div className="text-center text-green-600 dark:text-green-200 font-semibold mt-2">{message}</div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
