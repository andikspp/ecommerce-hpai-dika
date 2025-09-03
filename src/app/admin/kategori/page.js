"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaLayerGroup,
    FaSearch,
    FaBox,
    FaCalendarAlt,
    FaHashtag
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminKategoriPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [search, setSearch] = useState("");

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
        fetchCategories();
    }, [isChecking]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/kategori");
            setCategories(res.data || []);
        } catch (err) {
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    const handleEdit = (id) => {
        router.push(`/admin/kategori/edit?id=${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Kategori",
            text: "Apakah Anda yakin ingin menghapus kategori ini? Aksi ini tidak dapat dibatalkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg',
                cancelButton: 'rounded-lg'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/kategori?id=${id}`);
                setCategories(categories.filter(cat => cat.id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Kategori berhasil dihapus.",
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: err.response?.data?.error || "Gagal menghapus kategori.",
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            }
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat Data...</span>
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Kelola Kategori
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Mengelola semua kategori produk dalam toko Anda
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/admin/kategori/tambah")}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <FaPlus className="w-4 h-4" />
                            Tambah Kategori
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Kategori</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaLayerGroup className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hasil Pencarian</p>
                                <p className="text-2xl font-bold text-green-600">{filteredCategories.length}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaSearch className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kategori Aktif</p>
                                <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <FaBox className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="relative w-full lg:w-80">
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Menampilkan {filteredCategories.length} dari {categories.length} kategori
                        </div>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Memuat data kategori...</span>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <FaLayerGroup className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                        {search ? 'Kategori tidak ditemukan' : 'Belum ada kategori'}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        {search
                                                            ? 'Coba sesuaikan kata kunci pencarian Anda.'
                                                            : 'Mulai dengan menambahkan kategori pertama Anda.'
                                                        }
                                                    </p>
                                                    {!search && (
                                                        <button
                                                            onClick={() => router.push("/admin/kategori/tambah")}
                                                            className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                        >
                                                            <FaPlus className="w-4 h-4" />
                                                            Tambah Kategori Pertama
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((cat, idx) => (
                                            <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                            <FaLayerGroup className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {cat.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <FaHashtag className="w-3 h-3" />
                                                                ID: {cat.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(cat.id)}
                                                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition-colors"
                                                            title="Edit Kategori"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cat.id)}
                                                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition-colors"
                                                            title="Hapus Kategori"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}