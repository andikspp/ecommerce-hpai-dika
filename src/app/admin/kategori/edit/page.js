"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditKategoriPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Ambil id dari query (?id=...)
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if (isChecking) return;
        // Ambil data kategori berdasarkan id
        const fetchKategori = async () => {
            if (!id) return;
            try {
                const res = await axios.get(`/api/admin/kategori?id=${id}`);
                // Jika backend mengirim array, ambil index 0
                const kategori = Array.isArray(res.data) ? res.data[0] : res.data;
                setName(kategori?.name || kategori?.nama || "");
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Gagal mengambil data kategori.",
                });
                router.push("/admin/kategori");
            }
        };
        fetchKategori();
    }, [id, router, isChecking]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitting category:", name);
        try {
            await axios.put(`/api/admin/kategori?id=${id}`, { nama: name });
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Kategori berhasil diupdate!",
                timer: 1500,
                showConfirmButton: false
            });
            router.push("/admin/kategori");
        } catch (err) {
            await Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.error || "Gagal mengupdate kategori."
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
                    <h1 className="text-2xl font-bold text-green-700 dark:text-green-100 mb-6 text-center">Edit Kategori</h1>
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
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}