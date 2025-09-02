"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FaArrowLeft,
    FaSave,
    FaLayerGroup,
    FaAlignLeft,
    FaToggleOn,
    FaToggleOff,
    FaEdit
} from "react-icons/fa";
import Swal from "sweetalert2";

// Component yang menggunakan useSearchParams
function EditKategoriContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

    const fetchKategori = useCallback(async () => {
        try {
            const response = await axios.get(`/api/admin/kategori/${id}`);
            const kategori = response.data;
            setFormData({
                name: kategori.name || "",
                description: kategori.description || "",
                isActive: kategori.isActive ?? true,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Kategori tidak ditemukan atau terjadi kesalahan.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            }).then(() => {
                router.push("/admin/kategori");
            });
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (isChecking || !id) return;
        fetchKategori();
    }, [id, isChecking, fetchKategori]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Nama kategori harus diisi.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            return;
        }

        setSubmitting(true);

        try {
            await axios.put(`/api/admin/kategori?id=${id}`, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                isActive: formData.isActive,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Kategori berhasil diperbarui.",
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-2xl'
                }
            });

            router.push("/admin/kategori");
        } catch (error) {
            console.error("Error updating kategori:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.error || "Gagal memperbarui kategori.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat Data Kategori...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            <AdminSidebar handleLogout={handleLogout} />

            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.push("/admin/kategori")}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar Kategori
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FaEdit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Edit Kategori
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Perbarui informasi kategori
                    </p>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaLayerGroup className="w-5 h-5 text-blue-600" />
                                Informasi Kategori
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Kategori *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="Masukkan nama kategori"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deskripsi
                                    </label>
                                    <div className="relative">
                                        <FaAlignLeft className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                                            placeholder="Masukkan deskripsi kategori (opsional)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                            className="flex items-center gap-2 focus:outline-none group"
                                        >
                                            {formData.isActive ? (
                                                <>
                                                    <FaToggleOn className="text-green-500 text-2xl group-hover:text-green-600 transition-colors" />
                                                    <span className="text-sm font-medium text-green-600">Kategori Aktif</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaToggleOff className="text-gray-400 text-2xl group-hover:text-gray-500 transition-colors" />
                                                    <span className="text-sm font-medium text-gray-400">Kategori Nonaktif</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formData.isActive ? 'Kategori akan ditampilkan di sistem' : 'Kategori tidak akan ditampilkan di sistem'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/kategori")}
                                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="w-4 h-4" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

// Loading component untuk fallback
function EditKategoriLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Memuat Data Kategori...
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Mohon tunggu sebentar
                </p>
            </div>
        </div>
    );
}

// Main component dengan Suspense wrapper
export default function EditKategoriPage() {
    return (
        <Suspense fallback={<EditKategoriLoading />}>
            <EditKategoriContent />
        </Suspense>
    );
}