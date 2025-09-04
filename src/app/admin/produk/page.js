"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaSearch,
    FaFilter,
    FaBox,
    FaDollarSign,
    FaLayerGroup,
    FaWarehouse,
    FaEye,
    FaImage
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function AdminProdukPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categories, setCategories] = useState([]);

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
        fetchProducts();
        fetchCategories();
    }, [isChecking]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/api/produk");
            setProducts(res.data || []);
        } catch (err) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/kategori");
            setCategories(res.data || []);
        } catch (err) {
            setCategories([]);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    const handleAdd = () => {
        router.push("/admin/produk/tambah");
    };

    const handleEdit = (id) => {
        router.push(`/admin/produk/edit?id=${id}`);
    };

    const handleView = (id) => {
        router.push(`/admin/produk/detail?id=${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Produk",
            text: "Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak dapat dibatalkan!",
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
                await axios.delete(`/api/produk/${id}`);
                setProducts(products => products.filter(prod => prod.id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Produk berhasil dihapus.",
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
                    text: err.response?.data?.error || "Gagal menghapus produk.",
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const result = await Swal.fire({
            title: currentStatus ? "Nonaktifkan Produk" : "Aktifkan Produk",
            text: `Apakah Anda yakin ingin ${currentStatus ? 'menonaktifkan' : 'mengaktifkan'} produk ini?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: currentStatus ? "#f59e0b" : "#22c55e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: currentStatus ? "Nonaktifkan" : "Aktifkan",
            cancelButtonText: "Batal",
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg',
                cancelButton: 'rounded-lg'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/api/produk/${id}/status`, {
                    isActive: !currentStatus,
                });
                setProducts(products =>
                    products.map(prod =>
                        prod.id === id ? { ...prod, isActive: !currentStatus } : prod
                    )
                );
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `Produk berhasil ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}.`,
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
                    text: "Gagal mengubah status produk.",
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            }
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.categoryId === parseInt(categoryFilter);
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && product.isActive) ||
            (statusFilter === "inactive" && !product.isActive);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getProductStats = () => {
        const total = products.length;
        const active = products.filter(p => p.isActive).length;
        const inactive = products.filter(p => !p.isActive).length;
        const lowStock = products.filter(p => p.stock < 10).length;

        return { total, active, inactive, lowStock };
    };

    const stats = getProductStats();

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
                                Kelola Produk
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Mengelola semua produk dalam toko Anda
                            </p>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <FaPlus className="w-4 h-4" />
                            Tambah Produk
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Produk</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaBox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Produk Aktif</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaToggleOn className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Produk Nonaktif</p>
                                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                            </div>
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                <FaToggleOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stok Rendah</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaWarehouse className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    className="w-full md:w-80 px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                            <div className="relative">
                                <select
                                    className="w-full md:w-auto px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={categoryFilter}
                                    onChange={e => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                            <div className="relative">
                                <select
                                    className="w-full md:w-auto px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Menampilkan {filteredProducts.length} dari {products.length} produk
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Memuat data produk...</span>
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
                                            Produk
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Harga
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Stok
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <FaBox className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                        Tidak ada produk ditemukan
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        Coba sesuaikan filter pencarian Anda.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((prod, idx) => (
                                            <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                                            {prod.image ? (
                                                                <img
                                                                    src={prod.image}
                                                                    alt={prod.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <FaImage className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {prod.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                ID: {prod.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {prod.category?.name || "Tidak ada kategori"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <FaDollarSign className="w-3 h-3 text-green-600" />
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Rp {prod.price?.toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prod.stock < 10
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        }`}>
                                                        {prod.stock} unit
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleStatus(prod.id, prod.isActive)}
                                                        className="flex items-center gap-2 focus:outline-none group"
                                                        title={prod.isActive ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                                                    >
                                                        {prod.isActive ? (
                                                            <>
                                                                <FaToggleOn className="text-green-500 text-2xl group-hover:text-green-600 transition-colors" />
                                                                <span className="text-xs font-medium text-green-600">Aktif</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaToggleOff className="text-gray-400 text-2xl group-hover:text-gray-500 transition-colors" />
                                                                <span className="text-xs font-medium text-gray-400">Nonaktif</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleView(prod.id)}
                                                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                                                            title="Lihat Detail"
                                                        >
                                                            <FaEye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(prod.id)}
                                                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition-colors"
                                                            title="Edit Produk"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(prod.id)}
                                                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition-colors"
                                                            title="Hapus Produk"
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